const currentlyAiringAnime = require('currently-airing-anime');

import { storage } from './Store'
import MALjs, { ListResponse } from './Api'
import { User } from '../App'
import { Status } from '../components/Show'

export type AiringData = {
  id?: number
  airingDate: Date
  nextEpisode: number
}

export default class ListFetcher  {
  private malApi: MALjs
  private airingData: AiringData[] = []

  constructor() {
    this.malApi = new MALjs
  }

  /**
   * Get's the cached list data for the user. If there is airing data also cached
   * merge the airing data with the matching shows.
   *
   * @param  {User} user
   * @returns {Promise<ListResponse[]>}
   */
  public async getCachedListDataForUser(user: User): Promise<ListResponse[]> {

    const cachedList = await storage.get(`app.${user.username}.list`) as ListResponse[]
    this.airingData = await storage.get(`app.airing`) as AiringData[] || []

    if (!cachedList) {
      return []
    }

    if (this.airingData) {
      return this.mergeWithAiringData(cachedList)
    }

    return cachedList
  }

  /**
   * Fetch the users MyAnimeList from the network when the browser is idle.
   *
   * @param  {User} user
   * @returns {Promise<ListResponse[]>}
   */
  public async idlelyFetchListForUser(user: User): Promise<ListResponse[]> {
    this.malApi.setCredentials(user.username, user.password)

    return new Promise(resolve => {
      window.requestIdleCallback(() => {
        this.malApi.anime.list().then((fetchedList: ListResponse[]) => {
          fetchedList = this.mergeWithAiringData(fetchedList)
          storage.set(`app.${user.username}.list`, fetchedList)

          resolve(fetchedList)
        })
      }, {timeout: 2000})
    }) as Promise<ListResponse[]>
  }

  /**
   * For a given list of shows try to find airing information from AniList.
   *
   * The best way to match a show from MAL and AniList is to normalize all titles
   * from each show and find a match between them.
   *
   * @param  {ListResponse[]} shows
   * @returns {Promise<airingData[]>}
   */
  public async getAiringDatesForShows(listShows: ListResponse[]): Promise<AiringData[]> {
    const ids = listShows.filter(show => show.status === Status.watching).map(show => show.series.id);

    let { shows } = await currentlyAiringAnime({
      malIdIn: ids,
      season: false,
      seasonYear: false
    });

    if (!shows.length) {
      return [];
    }

    shows = shows.filter((show:any) => show.nextAiringEpisode);

    return shows.map((show: any) => ({
      id: show.idMal,
      airingDate: new Date(show.nextAiringEpisode.airingAt * 1000),
      nextEpisode: show.nextAiringEpisode.episode
    }));
  }

  /**
   * Merge airing data with corresponding shows.
   *
   * @param list
   */
  private mergeWithAiringData(list: ListResponse[])  {
    return list.map((item) => {
      const match = this.airingData.find(({id}) => id === item.series.id)
      if (!match) {
        return item
      }

      return {
        ...item,
        airing: {
          nextEpisode: match.nextEpisode,
          airingDate: match.airingDate
        }
      }
    })
  }
}
