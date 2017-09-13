import * as React from 'react'
import './Show.css'
import * as moment from 'moment'

// 1/watching, 2/completed, 3/onhold, 4/dropped, 6/plantowatch
export enum Status {
    watching = 1,
    completed = 2,
    onhold = 3,
    dropped = 4,
    plantowatch = 6,
}

export type ReadableStatus = 'watching'|'completed'|'plantowatch'|'dropped'|'onhold'

interface Props {
  seasonalData?: {
    type: string
    genres: string[]
  }
  title: string
  image: string
  startDateFuzzy?: {
    year: number
    month: number
    day: number
  }
  currentEpisode: number
  totalEpisodeCount: number
  status: Status
  id: number
  airing?: {
    nextEpisode: number
    airDate: Date
  }
  onShowUpdated?: (show: ShowUpdatedData) => void
}

export type ShowUpdatedData = {
  id: number,
  episode: number,
  status: Status
}

interface State {
  status: Status
  totalEpisodeCount: number
  currentEpisode: number
  showCompleteButton: boolean
}

export const toReadableStatus = (status: Status): ReadableStatus => {
  switch (status) {
    case 1:
      return 'watching'
    case 2:
      return 'completed'
    case 3:
      return 'onhold'
    case 4:
      return 'dropped'
    case 6:
      return 'plantowatch'
    default:
      throw new Error(`Status ${status} is unsupported.`)
  }
}

export default class Show extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const completed = (
      props.status !== Status.completed &&
      props.currentEpisode === props.totalEpisodeCount &&
      props.totalEpisodeCount !== 0
    )

    this.state = {
      status: completed ? Status.completed : props.status,
      totalEpisodeCount: props.totalEpisodeCount,
      currentEpisode: props.currentEpisode,
      showCompleteButton: completed
    }

    this.incrementEpisode = this.incrementEpisode.bind(this)
    this.decrementEpisode = this.decrementEpisode.bind(this)
    this.complete = this.complete.bind(this)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      status: nextProps.status,
      totalEpisodeCount: nextProps.totalEpisodeCount,
      currentEpisode: nextProps.currentEpisode,
      showCompleteButton: (
        nextProps.status !== Status.completed &&
        nextProps.currentEpisode === nextProps.totalEpisodeCount &&
        nextProps.totalEpisodeCount !== 0
      )
    })
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if ( // This performs
      nextProps.airing !== this.props.airing ||
      nextProps.currentEpisode !== this.props.currentEpisode ||
      nextProps.title !== this.props.title ||
      nextProps.image !== this.props.image ||
      nextProps.currentEpisode !== this.props.currentEpisode ||
      nextProps.totalEpisodeCount !== this.props.totalEpisodeCount ||
      nextProps.status !== this.props.status ||
      nextProps.id !== this.props.id ||
      nextState.status !== this.state.status ||
      nextState.totalEpisodeCount !== this.state.totalEpisodeCount ||
      nextState.currentEpisode !== this.state.currentEpisode ||
      nextState.showCompleteButton !== this.state.showCompleteButton
    ) {
      return true
    }

    return false
  }

  incrementEpisode() {
    if (
      (this.state.totalEpisodeCount !== 0 && this.state.currentEpisode >= this.state.totalEpisodeCount) ||
      (this.props.airing && this.state.currentEpisode >= this.props.airing.nextEpisode - 1)
    ) {
      return
    }

    const currentEpisode = this.state.currentEpisode + 1
    const isFinished = currentEpisode === this.state.totalEpisodeCount && this.state.totalEpisodeCount !== 0

    this.setState({
      currentEpisode: currentEpisode,
      showCompleteButton: this.state.status !== Status.completed && isFinished,
      status: isFinished ? Status.completed : this.state.status,
    })

    if (this.props.onShowUpdated) {
      this.props.onShowUpdated({
        id: this.props.id,
        episode: currentEpisode,
        status: this.props.status,
      })
    }
  }

  decrementEpisode() {
    if (this.state.currentEpisode <= 0) {
      return
    }

    const currentEpisode = this.state.currentEpisode - 1

    this.setState({
      currentEpisode: currentEpisode,
      showCompleteButton: false,
      status: this.props.status,
    })

    if (this.props.onShowUpdated) {
      this.props.onShowUpdated({
        id: this.props.id,
        episode: currentEpisode,
        status: this.props.status,
      })
    }
  }

  complete() {
    if (this.state.currentEpisode !== this.state.totalEpisodeCount) {
      return
    }

    if (this.props.onShowUpdated) {
      this.props.onShowUpdated({
        id: this.props.id,
        episode: this.state.currentEpisode,
        status: Status.completed
      })
    }
  }

  airedToday() {
    if (!this.props.airing) {
      return
    }

    const airs = moment(this.props.airing.airDate)
    const today = moment()

    return this.props.airing
      && this.props.airing.nextEpisode > 1
      && airs.diff(today, 'days') === 6
      && moment(today).startOf('day').isSameOrBefore(airs)
  }

  formatRelativeAiringDate(dateTime: Date) {
    const airs = moment(dateTime)
    const today = moment()

    if (airs.isBetween(moment(today).startOf('day'), moment(today).endOf('day'))) {
      return 'Airs today ' + airs.from(today)
    }

    if (this.airedToday()) {
      return 'Aired today'
    }

    if (airs.diff(today, 'days') > 7) {
      return 'Airs ' + airs.format('dddd, D MMMM')
    }

    const dayOfTheWeek = airs.format('dddd')

    return 'Airs ' + dayOfTheWeek + 's (' + airs.from(today, true) + ' left)'
  }

  formatFuzzyAiring() {
    const fuzzyDate = this.props.startDateFuzzy
    if (!fuzzyDate) {
      return null
    }

    if (fuzzyDate.year && fuzzyDate.month && fuzzyDate.day) {
      const airs = moment(`${fuzzyDate.year}-${fuzzyDate.month}-${fuzzyDate.day}`)
      return `Airs ${airs.format('dddd, D MMMM')}`
    }

    if (fuzzyDate.year && fuzzyDate.month) {
      const airs = moment(`${fuzzyDate.year}-${fuzzyDate.month}-01`)
      return `Airs in ${airs.format('MMMM')}`
    }

    return `Airs in ${fuzzyDate.year}`
  }

  render() {
    const { title, image, id, airing, seasonalData, startDateFuzzy } = this.props
    const { status, totalEpisodeCount, currentEpisode, showCompleteButton } = this.state

    const fullBorder = airing && currentEpisode !== airing.nextEpisode - 1 && this.airedToday()
    const airingDateString = airing && moment(airing.airDate).format('MM-DD-YYYY HH:mm')

    return (
      <article
        className={`
          Show
          Show--show-title-on-hover
          ${fullBorder ? 'Show--full-border' : ''}
          Show--status-is-${toReadableStatus(status)}
          `}
      >
        <header className="Show__title">
          <h4>{title}</h4>
        </header>
        {airing && (
          <time
            className="Show__airing"
            dateTime={airingDateString}
            title={airingDateString}
          >
            {`${this.formatRelativeAiringDate(airing.airDate)}`}
          </time>
        )}
        {(!airing && startDateFuzzy && startDateFuzzy.year) && (
          <time
            className="Show__airing"
          >
            {`${this.formatFuzzyAiring()}`}
          </time>
        )}
        <figure className="Show__image-container">
          <a
            href={
              id ? `https://myanimelist.net/anime/${id}`
                 : `https://myanimelist.net/search/all?q=${encodeURIComponent(this.props.title)}`}
            target="_blank"
            className="Show__link"
          >
            <img src={image} alt={title} />
          </a>
        </figure>
        {!seasonalData && (
          <div className="Show__drawer">
            <button
              className={`Show__complete-button ${showCompleteButton ? 'Show__complete-button--shown' : ''}`}
              onClick={this.complete}
            >
              Complete
            </button>
          </div>
        )}
        {!seasonalData && (
          <footer className="Show__controls">
            <button className="Show__episode-button" onClick={this.decrementEpisode}>-</button>
            <div className="Show__episode-count">
              <div>
                <span className="episode-count__title">Episodes seen:</span>
                <span className="episode-count__episodes">
                  <span>{currentEpisode}</span>/
                  {airing ? (
                    <span
                      className={airing.nextEpisode - 1 > currentEpisode ? 'next-episode' : ''}
                    >
                      {airing.nextEpisode - 1}
                    </span>
                  ) : (
                    <span>{totalEpisodeCount ? totalEpisodeCount : '??'}</span>
                  )}

                </span>
              </div>
            </div>
            <button className="Show__episode-button" onClick={this.incrementEpisode}>+</button>
          </footer>
        )}
        {seasonalData && (
          <footer className="Show__information">
            <div>
              <span className="Show__genres" title={seasonalData.genres.filter(v => v).join(', ')}>
                {seasonalData.genres.filter(v => v).join(', ')}
              </span>
              <span className="Show__type">{seasonalData.type}</span>
            </div>
            <div className="Show__episodes">
              {airing ? airing.nextEpisode : 0}/{totalEpisodeCount ? totalEpisodeCount : '??'}
            </div>
          </footer>
        )}
      </article>
    )
  }
}
