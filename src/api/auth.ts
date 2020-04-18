import axios from 'axios'
import { proxyURL, version } from './settings'
import { AuthAppType, IAuthNeed2FA, IAuthSuccess } from '../types/types'

// Возвращает токен или ошибку для повторного запроса с кодом 2FA
export async function auth (app: AuthAppType, username: string, password: string, code?: number) {
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

  try {
    return await axios.get(URL) as IAuthSuccess
  } catch (err) {
    return err.response.data as IAuthNeed2FA
  }
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
