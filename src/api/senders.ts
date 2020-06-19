import axios from 'axios'
import store from '../redux/store'
import { addCancelerItem } from '../redux/ducks/spamer/action-creators'
import { setChatName, setChatPhoto } from './helpers'
import { getBaseURL, ResponseType } from './config'

export async function sendToUser (
  token: string,
  userDomain: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType> {
  let URL = getBaseURL('messages.send', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `domain=${userDomain}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function sendToChat (
  token: string,
  chatId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType> {
  let URL = getBaseURL('messages.send', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `peer_id=${2000000000 + chatId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const promises: Promise<any>[] = []
  // @ts-ignore
  if (window.title) promises.push(setChatName(this.token, chatId, window.title))
  // @ts-ignore
  if (window.image) promises.push(setChatPhoto(this.token, window.image))

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const promise = axios.get(URL, { cancelToken: source.token })

  await Promise.allSettled(promises)
  const res = await promise
  return res.data
}

export async function sendToComments (
  token: string,
  commentId: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType<{ comment_id: number, parents_stack: any[] }>> {
  const [ownerId, postId] = commentId.split('_')
  let URL = getBaseURL('messages.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${ownerId}&`
  URL += `post_id=${postId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function sendToDiscussions (
  token: string,
  discussionsId: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType> {
  const [groupId, topicId] = discussionsId.split('_')
  let URL = getBaseURL('board.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `group_id=${groupId}&`
  URL += `topic_id=${topicId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function postToUser (
  token: string,
  userId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType<{ post_id: number }>> {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${userId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}

export async function postToGroup (
  token: string,
  groupId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<ResponseType<{ post_id: number }>> {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=-${groupId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  const res = await axios.get(URL, { cancelToken: source.token })
  return res.data
}
