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
  currentEpisode: number
  totalEpisodeCount: number
  status: Status
  id: string|number
  airing?: {
    nextEpisode: number
    airDate: Date
  }
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

    this.state = {
      status: props.status,
      totalEpisodeCount: props.totalEpisodeCount,
      currentEpisode: props.currentEpisode,
      showCompleteButton: false
    }

    this.incrementEpisode = this.incrementEpisode.bind(this)
    this.decrementEpisode = this.decrementEpisode.bind(this)
    this.complete = this.complete.bind(this)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      status: nextProps.status,
      totalEpisodeCount: nextProps.totalEpisodeCount,
      currentEpisode: nextProps.currentEpisode
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

    const count = this.state.currentEpisode + 1
    const isFinished = count === this.state.totalEpisodeCount && this.state.totalEpisodeCount !== 0

    this.setState({
      currentEpisode: count,
      showCompleteButton: this.state.status !== Status.completed && isFinished,
      status: isFinished ? Status.completed : this.state.status,
    })
  }

  decrementEpisode() {
    if (this.state.currentEpisode <= 0) {
      return
    }

    this.setState({
      currentEpisode: this.state.currentEpisode - 1,
      showCompleteButton: false,
      status: this.props.status,
    })
  }

  complete() {
    if (this.state.currentEpisode !== this.state.totalEpisodeCount) {
      return
    }

    console.log('TODO: Implement completing an show')
  }

  formatRelativeAiringDate(dateTime: Date) {
    const airs = moment(dateTime)
    const today = moment()

    if (airs.isBetween(today.startOf('day'), today.endOf('day'))) {
      return 'Airs today ' + airs.from(today)
    }

    if (airs.diff(today, 'days') === 6) {
      return 'Aired today'
    }

    if (airs.diff(today, 'days') > 8) {
      return 'Airs ' + airs.format('MM-DD-YYYY')
    }

    const dayOfTheWeek = airs.format('dddd')

    return 'Airs ' + dayOfTheWeek + 's (' + airs.from(today, true) + ' left)'
  }

  render() {
    const { title, image, id, airing, seasonalData } = this.props
    const { status, totalEpisodeCount, currentEpisode, showCompleteButton } = this.state

    return (
      <article
        className={`Show Show--show-title-on-hover Show--status-is-${toReadableStatus(status)}`}
      >
        <header className="Show__title">
          <h4>{title}</h4>
        </header>
        {airing && (
          <div className="Show__airing" data-ref="airing">{`${this.formatRelativeAiringDate(airing.airDate)}`}</div>
        )}
        <figure className="Show__image-container">
          <a href={`https://myanimelist.net/anime/${id}`} target="_blank" className="Show__link">
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
