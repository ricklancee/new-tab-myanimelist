import { storage } from './Store'
import MALjs from './Api'
import * as moment from 'moment'
import { User } from '../App'

type RequestData = {
  date_start?: string
  date_finish?: string
  episode?: number
  status?: 1|2|3|4|6
}

export default class ListUpdater {
  private user: User
  private api: MALjs

  constructor(user: User) {
    this.user = user
    this.api = (new MALjs()).setCredentials(user.username, user.password)
  }

  public async updateEpisodeCount(id: number, episode: number) {
    // tslint:disable-next-line:no-any
    const list = await storage.get(`app.${this.user.username}.list`) as any[]

    const indexOfShow = list.findIndex(({series}) => series.id === id)

    if (indexOfShow === -1) {
      return
    }

    const show = list[indexOfShow]
    const requestData = {} as RequestData

    // If the show has no startedAt, isn't beign rewatched and we started watching from
    // episode 0 to episode one we can assume we started watching the
    // show today.
    if (
      show.status === 1 &&
      !show.startedAt &&
      !show.rewatching &&
      show.watchedEpisodes === 0 &&
      episode === 1
    ) {
      const date = moment().format('MMDDYYYY')
      show.startedAt = date
      requestData.date_start = date
    }

    show.watchedEpisodes = episode
    requestData.episode = episode

    const updatedList = [
      ...list.slice(0, indexOfShow),
      show,
      ...list.slice(indexOfShow + 1),
    ]

    storage.set(`app.${this.user.username}.list`, updatedList)

    if (!process.env.REACT_APP_DEMO_MODE) {
      await this.api.update('anime', id, requestData)
    }
  }

  public async completeShow(id: number) {
    // tslint:disable-next-line:no-any
    const list = await storage.get(`app.${this.user.username}.list`) as any[]

    const indexOfShow = list.findIndex(({series}) => series.id === id)

    if (indexOfShow === -1) {
      return
    }

    const show = list[indexOfShow]
    const requestData = {} as RequestData

    if (
      !show.finishedAt &&
      !show.rewatching
    ) {
      const date = moment().format('MMDDYYYY')
      show.finishedAt = date
      requestData.date_finish = date
    }

    show.status = 2 // completed
    requestData.status = 2
    requestData.episode = show.series.episodes
    show.watchedEpisodes = show.series.episodes

    const updatedList = [
      ...list.slice(0, indexOfShow),
      show,
      ...list.slice(indexOfShow + 1),
    ]

    storage.set(`app.${this.user.username}.list`, updatedList)

    if (!process.env.REACT_APP_DEMO_MODE) {
      await this.api.update('anime', id, requestData)
    }
  }
}
