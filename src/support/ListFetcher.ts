import { storage } from './Store'
import MALjs, { ListResponse } from './Api'
import AniApi from './AniApi'
import { User } from '../App'

export type AiringData = {
  id?: number
  airingDate: Date
  nextEpisode: number
}

export default class ListFetcher  {
  private malApi: MALjs
  private aniApi: AniApi
  private airingData: AiringData[] = []

  constructor() {
    this.malApi = new MALjs
    this.aniApi = new AniApi
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
  public async getAiringDatesForShows(shows: ListResponse[]): Promise<AiringData[]> {
    const airing = await this.fetchAiring()
    return new Promise(resolve => {
        const results = airing.reduce((responseArray, airingShow) => {
          if (!airingShow.airing || !airingShow.airing.time || !airingShow.airing.next_episode) {
            return responseArray
          }

          const airingTitles = [
            airingShow.title_english,
            airingShow.title_japanese,
            airingShow.title_romaji,
            ...airingShow.synonyms
          ].filter(v => v).map(title => this.normalizeTitle(title))

          const index = shows.findIndex((show) => {

            const watchingTitles = [
              show.series.title,
              ...show.series.synonyms
            ].filter(v => v).map(title => this.normalizeTitle(title))

            return !!watchingTitles.find(title => !!airingTitles.find(t => t === title))
          })

          if (index === -1) {
            return responseArray
          }

          responseArray.push({
            id: shows[index].series.id,
            airingDate: new Date(airingShow.airing.time),
            nextEpisode: airingShow.airing.next_episode
          })

          return responseArray
        }, [] as AiringData[])

        storage.set('app.airing', results)

        resolve(results)
    }) as Promise<AiringData[]>
  }

  /**
   * Fetch all airing data from AniList
   */
  private async fetchAiring() {
    return await this.aniApi.getCurrentlyAiring()
  }

  /**
   * Normalize a show title.
   *
   * 'Ao no Exorcist: Kyoto Fujouou-hen' whould become 'Ao no Exorcist Kyoto Fujououhen'
   * A title show from MAL could be called 'Ao no Exorcist Kyoto Fujouou-hen' without
   * the : when a show from AniList could have a : therefor we remove all of these characters
   * to make sure we can find a match.
   *
   * @param  {string} title
   * @returns {string}
   */
  private normalizeTitle(title: string): string {
    return title.replace(/\s+/g, '')
          .replace('-', '')
          .replace('_', '')
          .replace(':', '')
          .replace(/'|"/, '')
          .toLowerCase()
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
