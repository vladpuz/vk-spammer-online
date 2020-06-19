import axios from 'axios'
import { apiVersion, authApps, getBaseURL, proxyURL, ResponseType } from './config'
import { AuthAppType, ProfileType } from '../types/types'

type AuthRes = {
  access_token: string
  expires_in: number
  user_id: number
  trusted_hash: string

  error: string
  error_description: string
  validation_type: string
  validation_sid: string
  phone_mask: string
  redirect_uri: string
  captcha_img: string
  captcha_sid: number
}

// Возвращает токен или ошибку для повторного запроса с кодом 2FA
export async function auth (
  username: string,
  password: string,
  opt: {
    app?: AuthAppType,
    code?: number,
    captchaKey?: string,
    captchaSid?: string
  } = { app: 'windows' }
): Promise<AuthRes> {
  const { app, code, captchaKey, captchaSid } = opt
  const { clientId, clientSecret } = authApps[app || 'windows']

  let URL = proxyURL + 'https://oauth.vk.com/token?'
  URL += 'grant_type=password&'
  URL += '2fa_supported=1&'
  URL += 'force_sms=1&'
  URL += `v=${apiVersion}&`
  URL += `client_id=${clientId}&`
  URL += `client_secret=${clientSecret}&`
  URL += `username=${username}&`
  URL += `password=${password}&`
  if (code) URL += `code=${code}&`
  if (captchaKey) URL += `captcha_key=${captchaKey}&`
  if (captchaSid) URL += `captcha_sid=${captchaSid}&`

  try {
    const res = await axios.get(URL)
    return res.data
  } catch (err) {
    return err.response.data
  }
}

// Возвращает данные о профиле
export async function getProfileInfo (token: string): Promise<ResponseType<ProfileType[]>> {
  let URL = getBaseURL('users.get', token)
  URL += 'fields=photo_50&'

  const res = await axios.get(URL)
  return res.data
}
