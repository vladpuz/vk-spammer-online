import axios from 'axios'
import store from '../redux/store'
import { addCancelerItem } from '../redux/ducks/spamer/action-creators'
import { getBaseURL, ResponseType } from './config'

export async function setChatName (token: string, chatId: number, title: string): Promise<ResponseType> {
  let URL = getBaseURL('messages.editChat', token)
  URL += `chat_id=${chatId}&`
  URL += `title=${title}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function setChatPhoto (
  token: string, file: string): Promise<ResponseType<{ message_id: number, chat: any }>> {
  let URL = getBaseURL('messages.setChatPhoto', token)
  URL += `file=${file}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function leaveTheChat (token: string, chatId: number, userId: number): Promise<ResponseType> {
  let URL = getBaseURL('messages.removeChatUser', token)
  URL += `chat_id=${chatId}&`
  URL += `user_id=${userId}&`

  const res = await axios.get(URL)
  return res.data
}
