import { set } from 'lodash'

type ResourceType = 'anime'|'manga'

type UserResponse = {
  id: number,
  username: string,
}

export type AnimeResponse = {
  id: number,
  title: string,
  english: string,
  synonyms: string,
  episodes: number,
  score: number,
  type: string,
  status: number,
  start_date: string,
  end_date: string,
  synopsis: string
}

export type AnimeValues = {
  episode?: number,
  status?: 1|2|3|4|6,
  score?: number,
  storage_type?: number,
  storage_value?: number,
  times_rewatched?: number,
  rewatch_value?: number,
  date_start?: string,
  date_finish?: string,
  priority?: number,
  enable_discussion?: 1|0,
  enable_rewatching?: 1|0,
  comments?: string,
  tags?: string
}

export type RawListResponse = {
  my_finish_date: string,
  my_id: string,
  my_last_updated: string,
  my_rewatching: string,
  my_rewatching_ep: string,
  my_score: string,
  my_start_date: string,
  my_status: string,
  my_tags: string,
  my_watched_episodes: string,
  series_animedb_id: string,
  series_end: string,
  series_episodes: string,
  series_image: string,
  series_start: string,
  series_status: string,
  series_synonyms: string,
  series_title: string,
  series_type: string,
}

export type ListResponse = {
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
  }
}

const convertDate = (v: string) => v !== '0000-00-00' ? new Date(v) : null

const conversionTable = {
  my_finish_date: ['finishedAt', convertDate],
  my_id: ['id', (v: string) => parseInt(v, 10)],
  my_last_updated: ['lastUpdated', (v: string) => new Date(parseInt(v, 10) * 1000)],
  my_rewatching: ['rewatching', (v: string) => v === '1'],
  my_rewatching_ep: ['rewatchingEpisode', (v: string) => parseInt(v, 10)],
  my_score: ['score', (v: string) => parseInt(v, 10)],
  my_start_date: ['startedAt', convertDate],
  my_status: ['status', (v: string) => parseInt(v, 10)],
  my_tags: ['tags', (v: string) => v.split('; ')],
  my_watched_episodes: ['watchedEpisodes', (v: string) => parseInt(v, 10)],
  series_animedb_id: ['series.id', (v: string) => parseInt(v, 10)],
  series_end: ['series.endedAt', convertDate],
  series_episodes: ['series.episodes', (v: string) => parseInt(v, 10)],
  series_image: ['series.image', (v: string) => v],
  series_start: ['series.startedAt', convertDate],
  series_status: ['series.status', (v: string) => parseInt(v, 10)],
  series_synonyms: ['series.synonyms', (v: string) => v.split('; ')],
  series_title: ['series.title', (v: string) => v],
  series_type: ['series.type', (v: string) => v],
}

export default class MALjs {
    public anime: {
      search: (query: string) => Promise<AnimeResponse|{}>
      list: () => Promise<ListResponse[]>
      add: (id: string|number, data: AnimeValues) => Promise<string>
      update: (id: string|number, data: AnimeValues) => Promise<string>
      delete: (id: string|number) => Promise<string>
    }

    private username: string
    private password: string
    private base: string
    private parser: DOMParser

    constructor() {
      this.base = 'https://myanimelist.net'

      this.parser = new DOMParser()

      // Api shorthand
      this.anime = {
        search: (query) => this.search('anime', query),
        list: () => this.list('anime'),
        add: (id, data) => this.add('anime', id, data),
        update: (id, data) => this.update('anime', id, data),
        delete: (id) => this.delete('anime', id)
      }
    }

    setCredentials(username: string, password: string): MALjs {
      this.username = username
      this.password = password

      return this
    }

    async search(type: ResourceType, query: string): Promise<AnimeResponse|{}> {
      const result = await this.get(`${this.base}/api/${type}/search.xml?q=${encodeURIComponent(query)}`) as {
        anime: AnimeResponse
      }

      if (!result || !result.anime) {
        return {}
      }

      return result.anime
    }

    async list(type: ResourceType): Promise<ListResponse[]> {
      const list = await this.get(
        `${this.base}/malappinfo.php?u=${this.username}&status=all&type=${type}`,
        false
      ) as {myanimelist: {anime: RawListResponse[]}}

      const reducer = (carry: ListResponse[], item: RawListResponse) => {

        const listItem = Object.keys(item).reduce((transformed: object, prop: string) => {
          const [desiredPropertyName, transformerFunction] = conversionTable[prop]
          const value = item[prop]

          return set(transformed, desiredPropertyName, value ? transformerFunction(value) : null)
        }, {})

        carry.push(listItem as ListResponse)
        return carry
      }

      return list.myanimelist.anime.reduce(reducer, [])
    }

    add(type: ResourceType, id: string|number, data: AnimeValues): Promise<string> {
      return this.post(`${this.base}/api/${type}list/add/${id}.xml`, data) as Promise<string>
    }

    update(type: ResourceType, id: string|number, data: AnimeValues): Promise<string> {
      return this.post(`${this.base}/api/${type}list/update/${id}.xml`, data) as Promise<string>
    }

    delete(type: ResourceType, id: string|number): Promise<string> {
      return this.post(`${this.base}/api/${type}list/delete/${id}.xml`) as Promise<string>
    }

    verifyCredentials(): Promise<UserResponse|{}> {
      return this.get(`${this.base}/api/account/verify_credentials.xml`)
        .catch(err => {
          return err
        })
    }

    private xmlToJson(xmlString: string) {
      return new Promise((resolve, reject) => {

        const dom = this.parser.parseFromString(xmlString, 'text/xml')

        if (dom.documentElement.nodeName === 'html') {
          reject('Failed to parse xml.')
        } else {
          resolve(this.domToJson(dom))
        }

      })
    }

    private domToJson(dom: Document) {
      const nodes = dom.childNodes
      const object = {}

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (node.nodeName === 'myanimelist') {
          object[node.nodeName] = {}
        } else {
          object[node.nodeName] = []
        }

        const childNodes = node.childNodes

        for (let k = 0; k < childNodes.length; k++) {
          const entryNode = childNodes[k]
          const entryObject = {}

          // Skip empty text nodes.
          if (entryNode.nodeName === '#text') {
            continue
          }

          const items = entryNode.childNodes

          for (let l = 0; l < items.length; l++) {
            const item = items[l] as HTMLElement

            if (item.nodeName === '#text') {
              continue
            }

            if (item.nodeName === 'id' || item.nodeName === 'episodes') {
              entryObject[item.nodeName] = parseInt(item.innerHTML, 10)
              continue
            }

            entryObject[item.nodeName] = item.innerHTML
          }

          if (node.nodeName === 'myanimelist') {
            if (entryNode.nodeName === 'anime' || entryNode.nodeName === 'manga') {
              if (!object[node.nodeName][entryNode.nodeName]) {
                object[node.nodeName][entryNode.nodeName] = []
              }
              object[node.nodeName][entryNode.nodeName].push(entryObject)
            } else {
              object[node.nodeName][entryNode.nodeName] = entryObject
            }
          } else {
            object[node.nodeName].push(entryObject)
          }
        }
      }

      return object
    }

    private toXml(object: object) {
      let xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`

      function getProps(obj: object) {
        for (let property in obj) {
          if (obj.hasOwnProperty(property)) {
            if (obj[property].constructor === Object) {
              xmlString += `<${property}>`
              getProps(obj[property])
              xmlString += `</${property}>`
            } else {
              xmlString += `<${property}>${obj[property]}</${property}>`
            }
          }
        }
      }

      getProps(object)

      return xmlString
    }

    private prependCorsAnywhere(url: string): string {
      return 'https://cors-anywhere.herokuapp.com/' + url
    }

    private get(url: string, auth: boolean = true) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()

        this.openRequest(req, 'GET', url, auth)

        req.onload = () => {
          const data = req.response

          if (req.status === 200) {
            // Covert the xml string to json
            this.xmlToJson(data)
              .then(resolve)
              .catch(reject)

          } else {
            reject(data)
          }
        }

        req.onerror = () => {
          reject(`Request failed: called url "${url}", with user "${this.username}" and password "${this.password}"`)
        }

        req.send()
      })
    }

    // tslint:disable-next-line:no-any
    private post(url: string, data?: any, auth: boolean = true) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()

        this.openRequest(req, 'POST', url, auth)

        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

        req.onload = () => {
          if (req.status === 200 || req.status === 201) {
            resolve(req.response)
          } else {
            reject(req.response)
          }
        }

        req.onerror = () => {
          reject(`
            Request failed:
            Called url "${url}", with user "${this.username}" and password "${this.password}".
            Data passed: "${JSON.stringify(data, null, 2)}"
          `)
        }

        if (data) {
          const object = {entry: data}
          const xml = this.toXml(object)
          req.send(`data=${xml}`)
        } else {
          req.send()
        }
      })
    }

    private openRequest(req: XMLHttpRequest, method: string, url: string, auth: boolean) {
      if (auth) {
        const URLObject = new URL(url)

        let authUrl =  URLObject.protocol + '//'
          + this.username + ':' + this.password + '@'
          + URLObject.href.replace(URLObject.protocol + '//', '')

        if (process.env.REACT_APP_DEMO_MODE) {
          authUrl = this.prependCorsAnywhere(authUrl)
        }

        req.open(method, authUrl, true)
      } else {
        if (process.env.REACT_APP_DEMO_MODE) {
          url = this.prependCorsAnywhere(url)
        }

        req.open(method, url)
      }
    }
  }
