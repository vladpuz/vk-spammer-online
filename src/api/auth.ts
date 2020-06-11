import { proxyURL, version } from './config'
import { AuthAppType, IAuthNeed2FA, IAuthSuccess } from '../types/types'
import axios from 'axios'

// Возвращает токен или ошибку для повторного запроса с кодом 2FA
export async function auth (
  app: AuthAppType,
  username: string,
  password: string,
  code?: number
): Promise<IAuthNeed2FA | IAuthSuccess> {
  const { clientID, clientSecret } = authApps[app]
  let URL = proxyURL + 'https://oauth.vk.com/token?'

  URL += 'grant_type=password&'
  URL += '2fa_supported=1&'
  URL += `v=${version}&`
  URL += `client_id=${clientID}&`
  URL += `client_secret=${clientSecret}&`
  URL += `username=${username}&`
  URL += `password=${password}&`
  URL += (code ? `code=${code}` : '')

  try {
    const res = await axios.get(URL)
    return await res.data
  } catch (err) {
    return err.response.data
  }
}

const authApps = {
  android: {
    clientID: '2274003',
    clientSecret: 'hHbZxrka2uZ6jB1inYsH'
  },
  iphone: {
    clientID: '3140623',
    clientSecret: 'VeWdmVclDCtn6ihuP1nt'
  },
  ipad: {
    clientID: '3682744',
    clientSecret: 'mY6CDUswIVdJLCD3j15n'
  },
  windows: {
    clientID: '3697615',
    clientSecret: 'AlVXZFMUqyrnABp8ncuU'
  },
  windowsPhone: {
    clientID: '3502557',
    clientSecret: 'PEObAuQi6KloPM4T30DV'
  }
}
