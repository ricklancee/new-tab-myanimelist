import { storage } from './Store'

type BearerToken = {
  access_token: string
  expires: number
  expires_in: number
  token_type: string
}

export type Series = {
  id: number
  series_type: string
  title_romaji: string
  title_english: string
  title_japanese: string
  type: Type
  start_date_fuzzy: number|null
  end_date_fuzzy: number|null
  synonyms: string[]
  genres: string[]
  adult: boolean
  average_score: number
  popularity: number
  image_url_sml: string
  image_url_med: string
  image_url_lge: string
  updated_at: number
  total_episodes: number
  airing_status: Status|null
  airing: {
    countdown: number
    next_episode: number
    time: string
  }
}

type Status = 'finished airing'|'currently airing'|'not yet aired'|'cancelled'
type Type = 'TV'|'TV Short'|'Movie'|'Special'|'OVA'|'ONA'|'Music'|'Manga'|'Novel'|'One Shot'|'Doujin'|'Manhua'|'Manhwa'
type Season = 'winter'|'spring'|'summer'|'fall'

export default class AniApi {
  private clientId: string = 'aardappeltaart-cmqds'
  private clientSecret: string = 'X9X9Hok53RIFmFT0iuXHa9GlE08eq'

  private base: string = 'https://anilist.co/api/'
  private token: BearerToken

  public async getCurrentlyAiring(): Promise<Series[]> {

    return await this.fetch('browse/anime', {
      status: 'Currently Airing',
      genres_exclude: 'Hentai',
      airing_data: 'true',
      full_page: 'true'
    })
  }

  public async getShowsForSeason(season: Season, year?: number): Promise<Series[]> {
    if (!year) {
      year = (new Date).getFullYear()
    }

    return await this.fetch('browse/anime', {
      year: year,
      season: season,
      genres_exclude: 'Hentai',
      airing_data: 'true',
      full_page: 'true'
    })
  }

  public async refreshAccessTokenIfNeeded() {
    await this.getClientCredentialsToken()
    return true
  }

  private async fetch(endpoint: string, params: object) {
    const token = await this.getClientCredentialsToken()

    const queryParamString = this.constructUriParams(params)

    return fetch(this.base + endpoint + '?' + queryParamString, {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token.access_token}`
      })
    }).then(response => response.json())
  }

  private async getClientCredentialsToken() {
    const token = await this.getToken()

    const unixNow = Math.round((new Date).getTime() / 1000)

    if (!token || (unixNow + 600) >= token.expires) { // 5 minutes before token expires refetch
      return await this.fetchClientCredentialsToken()
    }

    return token
  }

  private async fetchClientCredentialsToken(): Promise<BearerToken> {
    const authEndpoint = 'auth/access_token'

    const params = {
      grant_type: 'client_credentials',
      client_id:  this.clientId,
      client_secret:  this.clientSecret
    }

    const queryParams = this.constructUriParams(params)

    const response = await window.fetch(this.base + authEndpoint + '?' + queryParams, { method: 'POST' })
    const bearerToken = await response.json()

    if (bearerToken.errors) {
      throw new Error('Failed to get ClientCredentialsToken')
    }

    this.token = bearerToken as BearerToken
    this.cacheToken(this.token)

    return this.token
  }

  private cacheToken(token: BearerToken) {
    storage.set('app.aniToken', token)
  }

  private async getToken(): Promise<BearerToken|null> {
    if (this.token) {
      return this.token
    }

    return await storage.get('app.aniToken') as BearerToken|null
  }

  private constructUriParams(params: object): string {
    const query = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')

    return query
  }
}
