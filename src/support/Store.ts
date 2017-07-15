export default class Store {

  get(key: string): Promise<object[]|object> {
    return new Promise((resolve) => {
      // if (chrome && chrome.storage) {
      //   chrome.storage.local.get(key, resolve)
      //   return
      // }

      resolve(JSON.parse(
        window.localStorage.getItem(key) as string
      ))
    })
  }

  set(key: string, value: object): void  {
    // if (chrome && chrome.storage) {
    //   chrome.storage.local.set({key: value})
    //   return
    // }

    window.localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    window.localStorage.removeItem(key)
  }
}

export const storage = new Store()
