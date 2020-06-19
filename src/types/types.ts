export type LogStatusType = 'error' | 'success' | 'warning' | 'info' | 'pending'
export type AuthAppType = 'android' | 'iphone' | 'ipad' | 'windows' | 'windowsPhone'
export type SpamModeType = 'pm' | 'chat' | 'chatAutoExit' | 'usersWalls' | 'groupsWalls' | 'comments' | 'discussions'

export type SpamValuesType = {
  autoSwitchTime: number
  antiCaptchaKey: string
  message: string
  attachment: string
  sendInterval: number
  autoPauseTimeout: number
  onePass: boolean
  captchaMode: 'Антикапча' | 'Показывать капчу' | 'Игнорировать капчу'
  spamMode: SpamModeType
  addresses: string[]
}

export type ProfileType = {
  id: number
  first_name: string
  last_name: string
  is_closed: boolean
  can_access_closed: boolean
  photo_50: string
}

export type AccountType = {
  profile: ProfileType
  token: string
  currentSender: boolean
  isEnabled: boolean
  error: null | string
}

export type LogType = {
  title: string
  status: LogStatusType
  time: string
  key: string
}

export type CaptchaType = {
  userId: number
  captchaImg: string
  captchaKey: string
  captchaSid: number
}
