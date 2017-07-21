import { get, groupBy, flatten } from 'lodash'
import * as Fuse from 'fuse.js'

type SortFunc = (a: object, b: object) => number

export default class Filter {
  private data: object[] = []
  private filtered: object[] = []

  setData(data: object[]) {
    this.data = [...data]
    this.filtered = [...data]

    return this
  }

  transformList(transformFunction: (list: object[]) => object[]) {
    const newData = transformFunction([...this.data])
    this.data = [...newData]
    this.filtered = [...newData]

    return this
  }

  reset() {
    this.filtered = [...this.data]
    return this
  }

  filterByFuzzy(keys: string[], query: string) {
    if (query.length === 0) {
      return this
    }

    const fuse = new Fuse(this.filtered, {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 10,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        ...keys
      ]
    })

    this.filtered = fuse.search(query)

    return this
  }

  filterBy(key: string, value: string|number|boolean|null, sortFunc: SortFunc) {
    this.filtered = this.filtered.filter(item => {
      return get(item, key) === value
    }).sort(sortFunc)

    return this
  }

  groupBy(key: string, sortFunc: SortFunc) {
    const grouped = groupBy(this.filtered, key)

    const flattened = flatten(
      Object.keys(grouped)
        .map(item => grouped[item].sort(sortFunc))
    )

    this.filtered = flattened

    return this
  }

  get() {
    return this.filtered
  }
}
