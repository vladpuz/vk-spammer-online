type LocalStorageType = typeof localStorage
type SessionStorageType = typeof sessionStorage

// Позволяет записывать объекты в storage очень просто (bs.local.set(obj.names.firstName, 'Владислав'))
class BrowserStorage {
  private static set (storage: LocalStorageType | SessionStorageType, path: string, value: any) {
    const keys = path.split('.')
    const args = keys.slice(1, keys.length)

    let item = JSON.parse(storage.getItem(keys[0]) as string) || {}

    if (args.length > 1) {
      for (let i = 0; i < args.length - 1; i++) {
        // eslint-disable-next-line no-eval
        eval(`if (!item.${args[i]}) item.${args[i]} = {}`)
      }
    }

    // eslint-disable-next-line no-eval
    eval(`item${args.length ? '.' : ''}${args.join('.')} = value`)

    storage.setItem(keys[0], JSON.stringify(item))
  }

  private static get (storage: LocalStorageType | SessionStorageType, path: string) {
    const keys = path.split('.')
    const args = keys.slice(1, keys.length)

    let result = JSON.parse(storage.getItem(keys[0]) as string)

    if (result) {
      for (let i = 0; i < args.length; i++) {
        if (result) result = result[args[i]]
      }
    }

    return result
  }

  public static local = {
    set (path: string, value: any) {
      BrowserStorage.set(localStorage, path, value)
    },
    get (path: string) {
      return BrowserStorage.get(localStorage, path)
    },
  }

  public static session = {
    set (path: string, value: any) {
      BrowserStorage.set(sessionStorage, path, value)
    },
    get (path: string) {
      return BrowserStorage.get(sessionStorage, path)
    },
  }
}

export default BrowserStorage
