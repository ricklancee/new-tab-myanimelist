
import { get, groupBy, flatten } from 'lodash'

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

  filterBy(key: string, value: string|number|boolean|null, sortFunc: (a: object, b: object) => number) {
    this.filtered = this.filtered.filter(item => {
      return get(item, key) === value
    }).sort(sortFunc)
    return this
  }

  groupBy(key: string, sortFunc: (a: object, b: object) => number) {
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
