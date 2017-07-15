import * as React from 'react'
import './ListContainer.css'

import MALjs, { ListResponse } from '../support/Api'
import Filter from '../support/Filter'
import ListFetcher from '../support/ListFetcher'

import Show, { Status } from './Show'
import ActionBar from './ActionBar'
import ScrollContainer from './ScrollContainer'

interface State {
  shows: {
    finishedAt: Date,
    id: number,
    lastUpdated: Date,
    rewatching: boolean,
    rewatchingEpisode: number,
    score: number,
    startedAt: Date,
    status: number,
    tags: [string],
    watchedEpisodes: number,
    series: {
      id: number
      title: string
      endedAt: Date
      startedAt: Date
      episodes: number
      image: string
      status: 1|2|3|4|6
      synonyms: [string]
      type: string
    },
    airing?: {
      airingDate: Date,
      nextEpisode: number
    }
  }[]
}

interface Props {
  user: {
    password: string
    username: string
  }
}

const sortByStartedAt = (showA: ListResponse, showB: ListResponse) => {
  return new Date(showB.series.startedAt).getTime() - new Date(showA.series.startedAt).getTime()
}

export default class ListContainer extends React.Component<Props, State> {
  private list: ListResponse[] = []

  private skip: number = 0
  private limit: number = 35
  private max: number

  private filter: Filter
  private listFetcher: ListFetcher
  private currentFilterStatus: Status|'all' = Status.watching // Default sort = watching

  constructor(props: Props) {
    super(props)

    const malApi = (new MALjs()).setCredentials(props.user.username, props.user.password)

    this.state = {
      shows: []
    }

    this.filter = new Filter()
    this.listFetcher = new ListFetcher(malApi)

    this.setListData = this.setListData.bind(this)

    this.listFetcher.getCachedListDataForUser(props.user.username)
      .then(this.setListData)

    this.listFetcher.onListUpdated(this.setListData)

    // Since this is quite a heavy operation we get airing data later
    this.listFetcher.onListUpdated(async (list: ListResponse[]) => {
        const watchingShows = list.filter(({status}) => status === Status.watching)
        const airingData = await this.listFetcher.getAiringDatesForShows(watchingShows)

        // Update the filter to have the new data with airing information
        this.filter.setData((list: ListResponse[]) => {
          return list.map(show => {
            const match = airingData.find(({id}) => id === show.series.id)

            if (!match) {
              return show
            }

            return {
              ...show,
              airing: {
                airingDate: match.airingDate,
                nextEpisode: match.nextEpisode
              }
            }
          })
        })

        // Set the state for any shows that were are already in state
        this.setState({
          shows: this.state.shows.slice().map(show => {
            const match = airingData.find(({id}) => id === show.series.id)

            if (!match) {
              return show
            }

            return {
              ...show,
              airing: {
                airingDate: match.airingDate,
                nextEpisode: match.nextEpisode
              }
            }
          })
        })
    })

    this.onLoadMore = this.onLoadMore.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  setListData(list: ListResponse[]) {
    this.filter.setData(list)

    if (this.currentFilterStatus === 'all') {
      this.filter.groupBy('status', sortByStartedAt)
    } else {
      this.filter.filterBy('status', this.currentFilterStatus, sortByStartedAt)
    }

    this.list = this.filter.get()

    this.resetPagination()

    this.setState({
      shows: this.getListChunkFromList(this.list)
    })
  }

  getListChunkFromList(list: ListResponse[]): ListResponse[] {
    return list.slice(this.skip, this.skip + this.limit)
  }

  onLoadMore(done: () => void) {
    this.skip = this.skip + this.limit

    if (this.skip >= this.max) {
      done()
      return
    }

    this.setState({
      shows: [
        ...this.state.shows,
        ...this.getListChunkFromList(this.list)
      ]
    }, done)
  }

  onFilter(status: Status|'all') {
    this.filter.reset()
    this.currentFilterStatus = status

    if (status !== 'all') {
      this.filter.filterBy('status', status, sortByStartedAt)
    } else {
      this.filter.groupBy('status', sortByStartedAt)
    }

    this.list = this.filter.get()

    this.resetPagination()

    this.setState({
      shows: this.getListChunkFromList(this.list)
    })
  }

  resetPagination() {
    this.skip = 0
    this.max = this.list.length
  }

  render() {
    const { shows } = this.state

    return (
      <div className="ListContainer">
        <ActionBar onFilter={this.onFilter} />
        <ScrollContainer onLoadMore={this.onLoadMore}>
          {shows.map(show => {
            return <li key={show.series.id}>
                <Show
                  title={show.series.title}
                  image={show.series.image}
                  currentEpisode={show.watchedEpisodes}
                  totalEpisodeCount={show.series.episodes}
                  status={show.status}
                  id={show.series.id}
                  airing={show.airing ? {
                    nextEpisode: show.airing.nextEpisode,
                    airDate: show.airing.airingDate
                  } : undefined}
                />
              </li>
          })}
        </ScrollContainer>
      </div>
    )
  }
}
