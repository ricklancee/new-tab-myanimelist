import { storage } from './Store'
import MALjs from './Api'

export default class ListFetcher  {

  private callbacks: Function[] = []
  private api: MALjs

  constructor(api: MALjs) {
    this.api = api
  }

  public async getListForUser(username: string) {
    const cachedList = await storage.get(`app.${username}.list`)

    this.idlelyFetchListForUser(username)

    return cachedList
  }

  public onListUpdated(callback: Function) {
    this.callbacks.push(callback)
  }

  private async idlelyFetchListForUser(username: string) {
    window.requestIdleCallback(() => {
      this.api.anime.list().then((fetchedList: any[]) => {
        storage.set(`app.${username}.list`, fetchedList)
        this.callbacks.forEach(callback => callback(fetchedList))
      })
    }, {timeout: 2000})
  }

  // public async getAiringDatesForWatchingShows(): Promise<Array<Airing>> {
  //   if (!this.list) {
  //     throw new Error('No list was fetched, please fetch list before calling: getAiringDatesForWatchingShows()')
  //   }

  //   const airing = await this.fetchAiring();

  //   return await new Promise(resolve => {
  //     window.requestIdleCallback(() => {
  //       const watching = this.sorter.getWatchingShows(this.list)

  //       const results = airing.reduce((responseArray, show) => {
  //         if (!show.airing || !show.airing.time || !show.airing.next_episode) {
  //           return responseArray
  //         }

  //         const airingTitles = [
  //           show.title_english,
  //           show.title_japanese,
  //           show.title_romaji,
  //           ...show.synonyms
  //         ].map(this.normalizeTitle)

  //         const index = watching.findIndex(watchingShow => {

  //           const watchingTitles = [
  //             watchingShow.title,
  //             ...watchingShow.synonyms
  //           ].map(this.normalizeTitle)

  //           return !!watchingTitles.find(title => !!airingTitles.find(t => t === title))
  //         })

  //         if (index === -1) {
  //           return responseArray
  //         }

  //         responseArray.push({
  //           id: watching[index].id,
  //           date: new Date(show.airing.time),
  //           nextEpisode: show.airing.next_episode
  //         })

  //         return responseArray
  //       }, [])

  //       this.storage.setItem('nta-airing', JSON.stringify(results))
  //       resolve(results)

  //     }, {timeout: 1000})
  //   }) as Array<Airing>
  // }

  // private fetchAiring(): Promise<Array<AniListApiResponseObject>> {
  //   return fetch('./airing.json').then(response => response.json())
  // }

  // private findIndexOfMatchingTitles(listsOfTitles: Array<string>, toCheckAgainst: Array<string>): number {

  //   const index = listsOfTitles.findIndex((titles) => {
  //     for (let i = 0; i < titles.length; i++) {
  //       for (let k = 0; k < toCheckAgainst.length; k++) {
  //         if (titles[i] === toCheckAgainst[k]) {
  //           return true
  //         }
  //       }
  //     }

  //     return false
  //   })

  //   return index
  // }

  // private normalizeTitle(title: string): string {

  //   return title.replace(/\s+/g, '')
  //         .replace('-', '')
  //         .replace('_', '')
  //         .replace(':', '')
  //         .replace(/'|"/, '')
  //         .toLowerCase()
  // }
}
