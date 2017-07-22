import * as React from 'react'
import './ListContainer.css'
import { debounce } from 'lodash'

import { ListResponse } from '../support/Api'
import Filter from '../support/Filter'
import ListFetcher, { AiringData } from '../support/ListFetcher'
import ListUpdater from '../support/ListUpdater'
import { User } from '../App'
import Show, { Status, ShowUpdatedData } from './Show'
import ActionBar from './ActionBar'
import ScrollContainer from './ScrollContainer'
import Loading from './Loading'

type ListItem = {
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
}

interface State {
  shows: ListItem[]
  isLoading: boolean
}

interface Props {
  user: User
}

const sortByStartedAt = (showA: ListItem, showB: ListItem) => {
  if (showA.airing && !showB.airing) {
    return -1
  } else if (showB.airing && !showA.airing) {
    return 1
  }

  return new Date(showB.series.startedAt).getTime() - new Date(showA.series.startedAt).getTime()
}

/**
 * ListContainer handels the fetching, updating, rendering and filtering of shows.
 */
export default class ListContainer extends React.Component<Props, State> {
  private list: ListResponse[] = []

  private skip: number = 0
  private limit: number = 35
  private max: number

  private filter: Filter
  private listFetcher: ListFetcher
  private listUpdater: ListUpdater

  private currentFilterStatus: Status|'all' = Status.watching // Default sort = watching
  private currentFilterSearchQuery: string = ''

  private canCompleteFetch: boolean = true

  constructor(props: Props) {
    super(props)

    this.state = {
      shows: [],
      isLoading: false
    }

    this.filter = new Filter()
    this.listFetcher = new ListFetcher()
    this.listUpdater = new ListUpdater(props.user)

    this.listFetcher.getCachedListDataForUser(props.user)
        .then(list => {
          // If we don't have a cached list start a loading spinner.
          if (list.length === 0) {
            this.setState({
              isLoading: true
            })

            return
          }

          this.setListData(list)
        })

    if (window.navigator.onLine) {
      this.fetchUpdatedDataFromNetwork()
    } else {
      // Sometimes it happens when you (for example) open up your browser
      // but are still connecting to the internet; the app will load because files
      // are stored online but the fetch will fail. Therefor if the navigator is offline
      // we poll until it's online and only then fetch the list.
      const self = this;

      (function pollUntillOnline() {
        setTimeout(() => {
          if (!window.navigator.onLine) {
            return pollUntillOnline()
          }

          self.reloadImageInDom()
          self.fetchUpdatedDataFromNetwork()
        }, 250)
      })()
    }

    this.onLoadMore = this.onLoadMore.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onSearch = debounce(this.onSearch.bind(this), 150)
    this.onShowUpdated = debounce(this.onShowUpdated.bind(this), 225)
  }

  componentDidMount() {
    this.canCompleteFetch = true
  }

  componentWillUnmount() {
    this.canCompleteFetch = false
  }

  reloadImageInDom() {
    const images = this.state.shows.map(({series}) => series.image)
    if (images.length > 0) {
      images.forEach((url: string) => {
        const imageInDom = document.querySelector(`img[src="${url}"]`) as HTMLImageElement
        if (imageInDom) {
          imageInDom.src = url
        }
      })
    }
  }

  fetchUpdatedDataFromNetwork() {
    this.listFetcher.idlelyFetchListForUser(this.props.user)
      .then((list: ListItem[]) => {
        this.setListData(list)
        this.getAndSetAiringDataForWatchingShows(list)

        if (this.state.isLoading) {
          this.setState({
            isLoading: false,
          })
        }
      })
  }

  async getAndSetAiringDataForWatchingShows(list: ListItem[]) {
    const watchingShows = list.filter(({status}) => status === Status.watching)
    const airingData = await this.listFetcher.getAiringDatesForShows(watchingShows)

    // Update the filter to have the new data with airing information
    this.filter.transformList((originalList: ListItem[]) => {
      return this.mergeListWithAiringData(originalList, airingData)
    })

    if (this.canCompleteFetch) {
      // Set the airing data for any shows that are in state
      this.setState({
        shows: this.mergeListWithAiringData(this.state.shows.slice(), airingData)
      })
    }
  }

  mergeListWithAiringData(list: ListItem[], airingData: AiringData[]) {
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
  }

  setListData(list: ListItem[]) {
    this.filter.setData(list)

    if (this.currentFilterStatus === 'all') {
      this.filter.groupBy('status', sortByStartedAt)
    } else {
      this.filter.filterBy('status', this.currentFilterStatus, sortByStartedAt)
    }

    this.list = this.filter.get() as ListItem[]

    this.resetPagination()

    if (this.canCompleteFetch) {
      this.setState({
        shows: this.getListChunkFromList(this.list)
      })
    }
  }

  getListChunkFromList(list: ListItem[]): ListItem[] {
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

    this.filterByStatus(status)

    this.filter.filterByFuzzy(['series.title', 'series.synonyms'], this.currentFilterSearchQuery)

    this.list = this.filter.get() as ListItem[]

    this.resetPagination()

    this.setState({
      shows: this.getListChunkFromList(this.list)
    })
  }

  filterByStatus(status: Status|'all') {
    if (status !== 'all') {
      this.filter.filterBy('status', status, sortByStartedAt)
    } else {
      this.filter.groupBy('status', sortByStartedAt)
    }
  }

  onSearch(query: string) {
    this.filter.reset()

    this.currentFilterSearchQuery = query

    this.filterByStatus(this.currentFilterStatus)

    this.filter.filterByFuzzy(['series.title', 'series.synonyms'], this.currentFilterSearchQuery)

    this.list = this.filter.get() as ListItem[]

    this.resetPagination()

    this.setState({
      shows: this.getListChunkFromList(this.list)
    })
  }

  resetPagination() {
    this.skip = 0
    this.max = this.list.length
  }

  onShowUpdated(show: ShowUpdatedData) {
    this.filter.transformList((list: ListItem[]) => {
      const found = list.find(({series}) => series.id === show.id)

      if (found) {
        const alreadyCompleted = found.status === Status.completed

        // Since this is a reference we can update the object
        found.watchedEpisodes = show.episode
        found.status = show.status

        // If the show goes from a non completed status to completed
        // remove it from the current view.
        if (!alreadyCompleted && show.status === Status.completed) {
          const indexInState = this.state.shows.findIndex(({series}) => series.id === show.id)

          this.listUpdater.completeShow(show.id)

          this.setState({
            shows: [
              ...this.state.shows.slice(0, indexInState),
              ...this.state.shows.slice(indexInState + 1),
            ]
          })
        } else {
          this.listUpdater.updateEpisodeCount(show.id, show.episode)
        }
      }

      return list
    })
  }

  render() {
    const { shows, isLoading } = this.state

    return (
      <div className="ListContainer">
        <ActionBar onFilter={this.onFilter}  onSearch={this.onSearch} />

        {isLoading ? (
          <Loading label="Getting your list from MAL..."/>
        ) : (
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
                    onShowUpdated={this.onShowUpdated}
                  />
                </li>
            })}
          </ScrollContainer>
        )}
      </div>
    )
  }
}
