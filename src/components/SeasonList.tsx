import * as React from 'react'
import './SeasonList.css'
import ScrollContainer from './ScrollContainer'
import Loading from './Loading'
import Show from './Show'
import { capitalize } from 'lodash'
import currentlyAiringAnime from 'currently-airing-anime'

type Season = 'WINTER'|'SPRING'|'SUMMER'|'FALL'

interface State {
  // tslint:disable-next-line:no-any
  shows: any[]
  isLoading: boolean
  seasonYear: number
  season: Season
  canShowNextSeason: boolean
  canShowPreviousSeason: boolean
}

const seasons = {
  'winter': [0, 2],
  'spring': [3, 5],
  'summer': [6, 8],
  'fall': [9, 11]
}

export default class SeasonList extends React.Component<{}, State> {
  private getNextShows: Function

  constructor(props: {}) {
    super(props)

    this.state = {
      shows: [],
      isLoading: true,
      seasonYear: (new Date()).getFullYear(),
      season: this.getCurrentSeason(),
      canShowNextSeason: true,
      canShowPreviousSeason: true
    }

    this.fetchListFromNetwork()

    this.onLoadMore = this.onLoadMore.bind(this)
  }

  render() {
    const { shows, canShowNextSeason, canShowPreviousSeason,  isLoading } = this.state

    return (
      <div className="SeasonList">
        {isLoading ? (
          <Loading noDelay={true} label="Getting season data from AniList..." />
        ) : (
          <div>
            <div className="SeasonList__controls">
              {canShowPreviousSeason &&
                <button onClick={this.goToPreviousSeason}>&larr; {capitalize(this.getPreviousSeason())}</button>}
              <h2 className="SeasonList__title">
                {capitalize(this.state.season)} season
                {' '}
                {
                  this.state.season.toLowerCase() === 'winter'
                    ? `${this.state.seasonYear - 1}-${this.state.seasonYear}`
                    : this.state.seasonYear
                }
              </h2>
              {canShowNextSeason
                 && <button onClick={this.goToNextSeason}>{capitalize(this.getNextSeason())} &rarr;</button>}
            </div>
            <ScrollContainer onLoadMore={this.onLoadMore}>
              {shows.map(show => {
                return <li key={show.id}>
                    <Show
                      seasonalData={{
                        genres: show.genres,
                        type: show.format
                      }}
                      title={show.title.romaji}
                      image={show.coverImage.large}
                      currentEpisode={0}
                      totalEpisodeCount={show.episodes}
                      status={
                        // If a show already has one episode make the status 'watching/green'
                        show.nextAiringEpisode ? 1 : 6
                      }
                      id={show.idMal}
                      airing={show.nextAiringEpisode ? {
                        nextEpisode: show.nextAiringEpisode.episode,
                        airDate: new Date(show.nextAiringEpisode.airingAt * 1000)
                      } : undefined}
                      startDateFuzzy={show.startDate as {year: number, day: number, month: number}}
                    />
                  </li>
              })}
            </ScrollContainer>
          </div>
        )}
      </div>
    )
  }

  private goToNextSeason = () => {
    if (this.state.isLoading) {
      return
    }

    const nextSeason = this.getNextSeason()
    let nextSeasonYear = this.state.seasonYear
    let canShowNextSeason = true

    if (nextSeason.toLowerCase() === 'winter') {
      nextSeasonYear = nextSeasonYear + 1
    }

    const reachedNextYear = nextSeasonYear === (new Date()).getFullYear() + 1 &&
                            nextSeason.toLowerCase() === this.getCurrentSeason()

    if (reachedNextYear) {
      canShowNextSeason = false
    }

    this.setState({
      season: nextSeason,
      seasonYear: nextSeasonYear,
      canShowNextSeason: canShowNextSeason
    }, () => {
      this.fetchListFromNetwork()
    })
  }

  private goToPreviousSeason = () => {
    if (this.state.isLoading) {
      return
    }

    const previousSeason = this.getPreviousSeason()
    let previousSeasonYear = this.state.seasonYear
    let canShowPreviousSeason = true

    if (previousSeason.toLowerCase() === 'fall') {
      previousSeasonYear = previousSeasonYear - 1
    }

    const reachedPreviousYear = previousSeasonYear === (new Date()).getFullYear() - 1 &&
      previousSeason.toLowerCase() === this.getCurrentSeason()

    if (reachedPreviousYear) {
      canShowPreviousSeason = false
    }

    this.setState({
      season: previousSeason,
      seasonYear: previousSeasonYear,
      canShowPreviousSeason: canShowPreviousSeason
    }, () => {
      this.fetchListFromNetwork()
    })
  }

  private async fetchListFromNetwork() {
    this.setState({isLoading: true})

    const {shows, next} = await currentlyAiringAnime({
      season: this.state.season.toUpperCase() as Season,
      seasonYear: this.state.seasonYear
    })

    this.setState({
      shows: shows,
      isLoading: false
    })

    this.getNextShows = next
  }

  private getCurrentSeason() {
    const currentMonth = (new Date).getMonth()

    for (let season in seasons) {
      if (seasons.hasOwnProperty(season)) {
        const [from, to] = seasons[season]

        if (currentMonth >= from && currentMonth <= to) {
          return season as Season
        }
      }
    }

    throw new Error(`Month ${currentMonth} does not fall in the season object`)
  }

  private getNextSeason(): Season {
    const seasonStrings = Object.keys(seasons)
    const indexOfCurrentSeason = seasonStrings.indexOf(this.state.season)

    if (indexOfCurrentSeason === seasonStrings.length - 1) {
      return seasonStrings[0] as Season
    }

    return seasonStrings[indexOfCurrentSeason + 1] as Season
  }

  private getPreviousSeason(): Season {
    const seasonStrings = Object.keys(seasons)
    const indexOfCurrentSeason = seasonStrings.indexOf(this.state.season)

    if (indexOfCurrentSeason === 0) {
      return seasonStrings[seasonStrings.length - 1] as Season
    }

    return seasonStrings[indexOfCurrentSeason - 1] as Season
  }

  private async onLoadMore(done: () => void) {
    if (!this.getNextShows) {
      done()
      return
    }

    const {shows, next} = await this.getNextShows()

    this.getNextShows = next

    this.setState({
      shows: [
        ...this.state.shows,
        ...shows
      ]
    }, done)
  }
}
