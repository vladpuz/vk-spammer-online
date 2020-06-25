import ApiError, { VKErrorRes, AuthErrorRes } from './ApiError'
import { apiVersion, getBaseURL, proxyURL, server } from './config'
import { AuthAppType } from '../types/types'

const authApps = {
  android: { clientId: '2274003', clientSecret: 'hHbZxrka2uZ6jB1inYsH' },
  iphone: { clientId: '3140623', clientSecret: 'VeWdmVclDCtn6ihuP1nt' },
  ipad: { clientId: '3682744', clientSecret: 'mY6CDUswIVdJLCD3j15n' },
  windows: { clientId: '3697615', clientSecret: 'AlVXZFMUqyrnABp8ncuU' },
  windowsPhone: { clientId: '3502557', clientSecret: 'PEObAuQi6KloPM4T30DV' }
}

type AuthRes = {
  access_token: string
  expires_in: number
  user_id: number
  trusted_hash: string
}

// Возвращает токен или ошибку для повторного запроса с кодом 2FA
export const auth = async (
  username: string,
  password: string,
  opt?: {
    app?: AuthAppType,
    code?: number,
    captchaKey?: string,
    captchaSid?: string
  }
): Promise<AuthRes> => {
  const { clientId, clientSecret } = authApps[opt?.app || 'windows']

  let URL = proxyURL + 'https://oauth.vk.com/token?'
  URL += 'grant_type=password&'
  URL += '2fa_supported=1&'
  URL += 'force_sms=1&'
  URL += `v=${apiVersion}&`
  URL += `client_id=${clientId}&`
  URL += `client_secret=${clientSecret}&`
  URL += `username=${username}&`
  URL += `password=${password}&`
  if (opt?.code) URL += `code=${opt?.code}&`
  if (opt?.captchaKey) URL += `captcha_key=${opt?.captchaKey}&`
  if (opt?.captchaSid) URL += `captcha_sid=${opt?.captchaSid}&`

  const response = await server.get(URL)
  if (response.data.error) throw new ApiError<AuthErrorRes>(response)
  return response.data
}

export type GetProfileInfoRes = {
  id: number
  first_name: string
  last_name: string
  is_closed: boolean
  can_access_closed: boolean
  photo_50: string
}

// Возвращает данные о профиле
export const getProfileInfo = async (token: string): Promise<GetProfileInfoRes> => {
  let URL = getBaseURL(token, 'users.get')
  URL += 'fields=photo_50&'

  const response = await server.get(URL)
  if (response.data.error) throw new ApiError<VKErrorRes>(response)
  return response.data.response[0]
}
