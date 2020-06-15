import axios from 'axios'
import store from '../redux/store'
import { getBaseURL } from './config'
import { addCancelerItem } from '../redux/spamer-reducer'
import { setChatName, setChatPhoto } from './helpers'

export async function sendToUser (
  token: string,
  userDomain: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
  let URL = getBaseURL('messages.send', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `domain=${userDomain}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  console.log(URL)

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function sendToChat (
  token: string,
  chatId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
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
  return (await promise).data
}

export async function sendToComments (
  token: string,
  commentId: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
  const [ownerId, postId] = commentId.split('_')
  let URL = getBaseURL('messages.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${ownerId}&`
  URL += `post_id=${postId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function sendToDiscussions (
  token: string,
  discussionsId: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
  const [groupId, topicId] = discussionsId.split('_')
  let URL = getBaseURL('board.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `group_id=${groupId}&`
  URL += `topic_id=${topicId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function postToUser (
  token: string,
  userId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${userId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export async function postToGroup (
  token: string,
  groupId: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<any> {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=-${groupId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}
