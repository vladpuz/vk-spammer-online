import axios from 'axios'
import { proxyURL, versionAPI, authApps } from './config'
import { AuthAppType } from '../types/app-types'
import { IAuthRes } from '../types/api-types'

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
): Promise<IAuthRes> {
  const { app, code, captchaKey, captchaSid } = opt
  const { clientId, clientSecret } = authApps[app || 'windows']

  let URL = proxyURL + 'https://oauth.vk.com/token?'
  URL += 'grant_type=password&'
  URL += '2fa_supported=1&'
  URL += 'force_sms=1&'
  URL += `v=${versionAPI}&`
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
