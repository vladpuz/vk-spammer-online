export type LogStatusType = 'error' | 'success' | 'warning' | 'info' | 'pending'
export type AuthAppType = 'android' | 'iphone' | 'ipad' | 'windows' | 'windowsPhone'
export type SpamModeType = 'pm' | 'talks' | 'talksAutoExit' | 'usersWalls' | 'groupsWalls' | 'comments' | 'discussions'

export interface IValues {
  message: string
  attachment: string
  sendInterval: number
  autoPauseTimeout: number
  onePass: boolean
  captchaMode: 'Антикапча' | 'Показывать капчу' | 'Игнорировать капчу'
  spamMode: SpamModeType
  addressees: Array<string>
}

export interface IInitData {
  addresseeIndex: number
  senderIndex: number
  autoSwitchRemaining: number
}

export interface IProfileInfo {
  id: number
  first_name: string
  last_name: string
  is_closed: boolean
  can_access_closed: boolean
  photo_50: string
}

export interface IAccount {
  profileInfo: IProfileInfo
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
  userID: number
  captchaImg: string
  captchaKey: string
  captchaSid: number
}

export interface IAuthSuccess {
  access_token: string
  expires_in: number
  user_id: number
  trusted_hash: string
}

export interface IAuthNeed2FA {
  error: string
  error_description: string
  validation_type: string
  validation_sid: string
  phone_mask: string
  redirect_uri: string
}
