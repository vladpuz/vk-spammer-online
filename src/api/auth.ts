import { proxyURL, version } from './settings'
import { AuthAppType } from '../types/types'

interface ISuccess {
  access_token: string
  expires_in: number
  user_id: number
  trusted_hash: string
}

interface IAuth2FA {
  error: string
  error_description: string
  validation_type: string
  validation_sid: string
  phone_mask: string
  redirect_uri: string
}

// Возвращает токен или ошибку для повторного запроса с кодом 2FA
export async function auth (
  app: AuthAppType,
  username: string,
  password: string,
  code?: number,
): Promise<ISuccess & IAuth2FA> {
  const { client_id, client_secret } = authApps[app]
  let URL = proxyURL + 'https://oauth.vk.com/token?'

  URL += 'grant_type=password&'
  URL += '2fa_supported=1&'
  URL += `v=${version}&`
  URL += `client_id=${client_id}&`
  URL += `client_secret=${client_secret}&`
  URL += `username=${username}&`
  URL += `password=${password}&`
  URL += (code ? `code=${code}` : '')

  return (await fetch(URL)).json()
}

const authApps = {
  android: {
    client_id: '2274003',
    client_secret: 'hHbZxrka2uZ6jB1inYsH',
  },
  iphone: {
    client_id: '3140623',
    client_secret: 'VeWdmVclDCtn6ihuP1nt',
  },
  ipad: {
    client_id: '3682744',
    client_secret: 'mY6CDUswIVdJLCD3j15n',
  },
  windows: {
    client_id: '3697615',
    client_secret: 'AlVXZFMUqyrnABp8ncuU',
  },
  windowsPhone: {
    client_id: '3502557',
    client_secret: 'PEObAuQi6KloPM4T30DV',
  },
}
