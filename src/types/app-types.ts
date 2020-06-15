import { IGetProfileInfoRes } from './api-types'

export type LogStatusType = 'error' | 'success' | 'warning' | 'info' | 'pending'
export type AuthAppType = 'android' | 'iphone' | 'ipad' | 'windows' | 'windowsPhone'
export type SpamModeType = 'pm' | 'chat' | 'chatAutoExit' | 'usersWalls' | 'groupsWalls' | 'comments' | 'discussions'

export interface ISpamValues {
  autoSwitchTime: number
  antiCaptchaKey: string
  message: string
  attachment: string
  sendInterval: number
  autoPauseTimeout: number
  onePass: boolean
  captchaMode: 'Антикапча' | 'Показывать капчу' | 'Игнорировать капчу'
  spamMode: SpamModeType
  addresses: Array<string>
}

export interface IAccount {
  profileInfo: IGetProfileInfoRes
  token: string
  currentSender: boolean
  isEnabled: boolean
  error: null | string
}

export interface ILog {
  title: string
  status: LogStatusType
  time: string
  key: string
}

export interface ICaptcha {
  userId: number
  captchaImg: string
  captchaKey: string
  captchaSid: number
}
