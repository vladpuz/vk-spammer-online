import axios from 'axios'
import store from '../redux/store'
import { getBaseURL } from './config'
import { addCancelerItem } from '../redux/spamer-reducer'
import { leaveTheTalk, setChatName, setChatPhoto } from './helpers'

export const sendToUser = async (
  token: string,
  userDomain: string,
  message?: string,
  attachment?: string,
  opt?: { captchaKey: string, captchaSid: string }
) => {
  let URL = getBaseURL('messages.send', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `domain=${userDomain}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export const sendToTalk = async (
  token: string,
  talkID: number,
  message?: string,
  attachment?: string,
  opt?: { captchaKey?: string, captchaSid?: string }
) => {
  let URL = getBaseURL('messages.send', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `peer_id=${2000000000 + talkID}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  // @ts-ignore
  if (window.title) setChatName(this.token, talkID, window.title).then(r => { console.log(r) })
  // @ts-ignore
  if (window.image) setChatPhoto(this.token, window.image).then(r => { console.log(r) })

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export const sendToTalkAndLeave = async (
  token: string,
  talkID: number,
  message: string,
  attachment: string,
  opt: { captchaKey?: string, captchaSid?: string, userID: number }
) => {
  await sendToTalk(token, talkID, message, attachment, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  return (await leaveTheTalk(token, talkID, opt?.userID)).data
}

export const sendToComments = async (
  token: string,
  commentID: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: string }
) => {
  const [ownerID, postID] = commentID.split('_')
  let URL = getBaseURL('messages.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${ownerID}&`
  URL += `post_id=${postID}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export const sendToDiscussions = async (
  token: string,
  discussionsID: string,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: string }
) => {
  const [groupID, topicID] = discussionsID.split('_')
  let URL = getBaseURL('board.createComment', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `group_id=${groupID}&`
  URL += `topic_id=${topicID}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export const postToUser = async (
  token: string,
  userID: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: string }
) => {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${userID}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}

export const postToGroup = async (
  token: string,
  groupID: number,
  message: string,
  attachment: string,
  opt?: { captchaKey?: string, captchaSid?: string }
) => {
  let URL = getBaseURL('wall.post', token, { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=-${groupID}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const source = axios.CancelToken.source()
  store.dispatch(addCancelerItem(source))
  return (await axios.get(URL, { cancelToken: source.token })).data
}
