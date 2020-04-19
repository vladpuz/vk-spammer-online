import { version, proxyURL } from './settings'
import store from '../redux/store'
import { addCancelerItem } from '../redux/spamer-reducer'

export async function editChat (token: string, talkID: number, title: string) {
  let URL = `${proxyURL}https://api.vk.com/method/messages.editChat?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `chat_id=${talkID}&`
  URL += `title=${title}&`

  const abortController = new AbortController()
  store.dispatch(addCancelerItem(abortController))

  const res = await fetch(URL, { signal: abortController.signal })
  return await res.json()
}
