import { storage } from './Store'
import MALjs from './Api'
import AniApi from './AniApi'

type AiringData = {
  id?: number
  airingDate: Date
  nextEpisode: number
}

export default class ListFetcher  {

  private callbacks: Function[] = []
  private malApi: MALjs
  private aniApi: AniApi
  private airingData: AiringData[] = []

  constructor(malApi: MALjs) {
    this.malApi = malApi
    this.aniApi = new AniApi
  }

  public async getCachedListDataForUser(username: string) {
    const cachedList = await storage.get(`app.${username}.list`) as object[]
    this.airingData = await storage.get(`app.airing`) as AiringData[] || []

    this.idlelyFetchListForUser(username)

    if (!cachedList) {
      return []
    }

    return this.mergeWithAiringData(cachedList)
  }

  public onListUpdated(callback: Function) {
    this.callbacks.push(callback)
  }

  public async getAiringDatesForShows(shows: any[]) {
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

  private async fetchAiring() {
    return await this.aniApi.getCurrentlyAiring()
  }

  private async idlelyFetchListForUser(username: string) {
    window.requestIdleCallback(() => {
      this.malApi.anime.list().then((fetchedList: any[]) => {
        fetchedList = this.mergeWithAiringData(fetchedList)
        storage.set(`app.${username}.list`, fetchedList)
        this.callbacks.forEach(callback => callback(fetchedList))
      })
    }, {timeout: 2000})
  }

  private normalizeTitle(title: string): string {
    return title.replace(/\s+/g, '')
          .replace('-', '')
          .replace('_', '')
          .replace(':', '')
          .replace(/'|"/, '')
          .toLowerCase()
  }

  private mergeWithAiringData(list: any[]) {
    return list.map((item: any) => {
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
