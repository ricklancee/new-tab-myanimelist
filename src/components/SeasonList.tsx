import * as React from 'react'
import './SeasonList.css'
import ScrollContainer from './ScrollContainer'
import Loading from './Loading'
import Show from './Show'
import { capitalize } from 'lodash'
import currentlyAiringAnime from 'currently-airing-anime'

interface State {
  shows: any[]
  isLoading: boolean
}

export default class SeasonList extends React.Component<{}, State> {
  private getNextShows: Function

  constructor(props: {}) {
    super(props)

    this.state = {
      shows: [],
      isLoading: true
    }

    this.fetchListFromNetwork()

    this.onLoadMore = this.onLoadMore.bind(this)
  }

  render() {
    const { shows, isLoading } = this.state

    return (
      <div className="SeasonList">
        {isLoading ? (
          <Loading noDelay={true} label="Getting season data from AniList..." />
        ) : (
          <div>
            <h2 className="SeasonList__title">{capitalize(this.getCurrentSeason())} season {(new Date).getFullYear()}</h2>
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

  private async fetchListFromNetwork() {

    const {shows, next} = await currentlyAiringAnime()

    this.setState({
      shows: shows,
      isLoading: false
    })

    this.getNextShows = next
  }

  private getCurrentSeason() {
    const seasons = {
      'winter': [0, 2],
      'spring': [3, 5],
      'summer': [6, 8],
      'fall': [9, 11]
    }

    const currentMonth = (new Date).getMonth()

    for (let season in seasons) {
      if (seasons.hasOwnProperty(season)) {
        const [from, to] = seasons[season]

        if (currentMonth >= from && currentMonth <= to) {
          return season as 'winter'|'spring'|'summer'|'fall'
        }
      }
    }

    throw new Error(`Month ${currentMonth} does not fall in the season object`)
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
