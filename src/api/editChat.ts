import { version, proxyURL } from './config'
import store from '../redux/store'
import { addCancelerItem } from '../redux/spamer-reducer'
import axios from 'axios'

export async function editChat (token: string, talkID: number, title: string) {
  let URL = `${proxyURL}https://api.vk.com/method/messages.editChat?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `chat_id=${talkID}&`
  URL += `title=${title}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))

  const res = await axios.get(URL, { cancelToken: source.token })
  return await res.data
}
