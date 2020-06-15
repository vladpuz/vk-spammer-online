import axios from 'axios'
import store from '../redux/store'
import { getBaseURL } from './config'
import { addCancelerItem } from '../redux/spamer-reducer'
import { IGetProfileInfoRes } from '../types/api-types'

export async function setChatName (token: string, chatId: number, title: string): Promise<any> {
  let URL = getBaseURL('messages.editChat', token)
  URL += `chat_id=${chatId}&`
  URL += `title=${title}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function setChatPhoto (token: string, file: string): Promise<any> {
  let URL = getBaseURL('messages.setChatPhoto', token)
  URL += `file=${file}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function getProfileInfo (token: string): Promise<IGetProfileInfoRes> {
  let URL = getBaseURL('users.get', token)
  URL += 'fields=photo_50&'

  return (await axios.get(URL)).data.response[0]
}

export async function leaveTheChat (token: string, chatId: number, userId: number): Promise<any> {
  let URL = getBaseURL('messages.removeChatUser', token)
  URL += `chat_id=${chatId}&`
  URL += `user_id=${userId}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}
