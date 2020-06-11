import axios from 'axios'
import store from '../redux/store'
import { getBaseURL } from './config'
import { addCancelerItem } from '../redux/spamer-reducer'
import { IProfileInfo } from '../types/types'

export async function setChatName (token: string, talkID: number, title: string) {
  let URL = getBaseURL('messages.editChat', token)
  URL += `chat_id=${talkID}&title=${title}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function setChatPhoto (token: string, file: string) {
  let URL = getBaseURL('messages.setChatPhoto', token)
  URL += `file=${file}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function getProfileInfo (token: string, userDomain: string | number): Promise<IProfileInfo> {
  let URL = getBaseURL('users.get', token)
  URL += `user_ids=${userDomain}&fields=photo_50&`

  return (await axios.get(URL)).data.response[0]
}

export async function leaveTheTalk (token: string, talkID: number, userID: number) {
  let URL = getBaseURL('messages.removeChatUser', token)
  URL += `chat_id=${talkID}&user_id=${userID}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}
