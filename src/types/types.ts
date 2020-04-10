export type logStatusType = 'error' | 'success' | 'warning' | 'info'
export type authAppType = 'android' | 'iphone' | 'ipad' | 'windows' | 'windowsPhone'
export type spamModeType = 'pm' | 'talks' | 'talksAutoExit' | 'usersWalls' | 'groupsWalls' | 'comments' | 'discussions'

export interface ISender {
  token: string
  userID: number
  message: string
  attachment: string
  sendToPM: (userDomain: string) => Promise<any>
  sendToTalk: (talkID: number) => Promise<any>
  sendToTalkAndLeave: (talkID: number) => Promise<any>
  sendToComments: (commentID: string) => Promise<any>
  sendToDiscussions: (discussionsID: string) => Promise<any>
  postToUser: (userID: number) => Promise<any>
  postToGroup: (groupID: number) => Promise<any>
}

export interface IValues {
  message: string
  attachment: string
  sendInterval: number
  autoPauseTimeout: number
  onePass: boolean
  antiCaptcha: boolean
  spamMode: spamModeType
  addressees: Array<string>
}

export interface ISpamData {
  addresseeIndex: number
  senderIndex: number
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
  time: string
  status: logStatusType
  key: number
}