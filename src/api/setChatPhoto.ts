import { version, proxyURL } from './config'
import store from '../redux/store'
import { addCancelerItem } from '../redux/spamer-reducer'
import axios from 'axios'

export async function setChatPhoto (token: string, file: string) {
  let URL = `${proxyURL}https://api.vk.com/method/messages.setChatPhoto?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `file=${file}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))

  const res = await axios.get(URL, { cancelToken: source.token })
  return await res.data
}
