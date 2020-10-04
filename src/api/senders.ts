import { setChatName, setChatPhoto } from './helpers'
import ApiError, { VKErrorRes } from './ApiError'
import { getBaseURL, server } from './config'
import { CancelToken } from 'axios'

export const sendToUser = async (
  token: string,
  userDomain: string,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: number }> => {
  let URL = getBaseURL(token, 'messages.send', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `domain=${userDomain}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const response = await server.get(URL, { cancelToken })
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const sendToChat = async (
  token: string,
  chatId: number,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: number }> => {
  let URL = getBaseURL(token, 'messages.send', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `random_id=${Date.now()}&`
  URL += `peer_id=${2000000000 + chatId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const promises: Promise<any>[] = []
  // @ts-ignore
  if (window.title) promises.push(setChatName(this.token, chatId, window.title))
  // @ts-ignore
  if (window.image) promises.push(setChatPhoto(this.token, window.image))

  const promise = server.get(URL, { cancelToken })
  await Promise.allSettled(promises)

  const response = await promise
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const sendToComments = async (
  token: string,
  commentId: string,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: { comment_id: number, parents_stack: any[] } }> => {
  const [ownerId, postId] = commentId.split('_')
  let URL = getBaseURL(token, 'wall.createComment', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${ownerId}&`
  URL += `post_id=${postId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const response = await server.get(URL, { cancelToken })
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const sendToDiscussions = async (
  token: string,
  discussionsId: string,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: number }> => {
  const [groupId, topicId] = discussionsId.split('_')
  let URL = getBaseURL(token, 'board.createComment', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `group_id=${groupId}&`
  URL += `topic_id=${topicId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const response = await server.get(URL, { cancelToken })
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const postToUser = async (
  token: string,
  userId: number,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: { post_id: number } }> => {
  let URL = getBaseURL(token, 'wall.post', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=${userId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const response = await server.get(URL, { cancelToken })
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const postToGroup = async (
  token: string,
  groupId: number,
  message: string,
  attachment: string,
  cancelToken: CancelToken,
  opt?: { captchaKey?: string, captchaSid?: number }
): Promise<{ response: { post_id: number } }> => {
  let URL = getBaseURL(token, 'wall.post', { captchaKey: opt?.captchaKey, captchaSid: opt?.captchaSid })
  URL += `owner_id=-${groupId}&`
  if (message) URL += `message=${message}&`
  if (attachment) URL += `attachment=${attachment}&`

  const response = await server.get(URL, { cancelToken })
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}
