import { version, proxyURL } from './settings'
import store from '../redux/store'
import { addCancelerItem } from '../redux/spamer-reducer'

export async function setChatPhoto (token: string, file: string) {
  let URL = `${proxyURL}https://api.vk.com/method/messages.setChatPhoto?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `file=${file}&`

  const abortController = new AbortController()
  store.dispatch(addCancelerItem(abortController))

  const res = await fetch(URL, { signal: abortController.signal })
  return await res.json()
}
