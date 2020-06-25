import ApiError, { VKErrorRes } from './ApiError'
import { getBaseURL, server } from './config'

export const setChatName = async (token: string, chatId: number, title: string): Promise<{ response: number }> => {
  let URL = getBaseURL(token, 'messages.editChat')
  URL += `chat_id=${chatId}&`
  URL += `title=${title}&`

  const response = await server.get(URL)
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const setChatPhoto = async (
  token: string,
  file: string
): Promise<{ response: { message_id: number, chat: any } }> => {
  let URL = getBaseURL(token, 'messages.setChatPhoto')
  URL += `file=${file}&`

  const response = await server.get(URL)
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}

export const leaveTheChat = async (token: string, chatId: number, userId: number): Promise<{ response: number }> => {
  let URL = getBaseURL(token, 'messages.removeChatUser')
  URL += `chat_id=${chatId}&`
  URL += `user_id=${userId}&`

  const response = await server.get(URL)
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data
}
