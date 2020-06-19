import * as types from './action-types'
import { LogStatusType } from '../../../types/types'

export const setSpamOnRun = (onRun: boolean) => ({
  type: types.SET_SPAM_ON_RUN,
  onRun
})

export const setSpamOnPause = (onPause: boolean) => ({
  type: types.SET_SPAM_ON_PAUSE,
  onPause
})

export const setStartTimestamp = (seconds: number) => ({
  type: types.SET_START_TIMESTAMP,
  seconds
})

export const addLogItem = (title: string, status: LogStatusType, key: string) => ({
  type: types.ADD_LOG_ITEM,
  item: {
    title,
    status,
    time: new Date().toLocaleTimeString(),
    key
  }
})

export const changeLogItem = (key: string, data: { title?: string, status?: LogStatusType }) => ({
  type: types.CHANGE_LOG_ITEM,
  key,
  data
})

export const clearLog = () => ({
  type: types.CLEAR_LOG
})

export const setAddresseeIndex = (index: number) => ({
  type: types.SET_ADDRESSEE_INDEX,
  index
})

export const setSenderIndex = (index: number) => ({
  type: types.SET_SENDER_INDEX,
  index
})

export const setAutoSwitchRemaining = (seconds: number) => ({
  type: types.SET_AUTO_SWITCH_REMAINING,
  seconds
})

export const setSpamTimerId = (id: number) => ({
  type: types.SET_SPAM_TIMER_ID,
  id
})

export const setSenderTimerId = (id: number) => ({
  type: types.SET_SENDER_TIMER_ID,
  id
})

export const setAutoPauseTimerId = (id: number) => ({
  type: types.SET_AUTO_PAUSE_TIMER_ID,
  id
})

export const setNotificationTimerId = (id: number) => ({
  type: types.SET_NOTIFICATION_TIMER_ID,
  id
})

export const addCaptchaItem = (img: string, sid: number, userId: number) => ({
  type: types.ADD_CAPTCHA_ITEM,
  img,
  sid,
  userId
})

export const removeCaptchaItem = (userId: number) => ({
  type: types.REMOVE_CAPTCHA_ITEM,
  userId
})

export const clearCaptcha = () => ({
  type: types.CLEAR_CAPTCHA
})

export const unravelCaptchaItem = (userId: number, key: string) => ({
  type: types.UNRAVEL_CAPTCHA_ITEM,
  userId,
  key
})

export const addCancelerItem = (canceler: any) => ({
  type: types.ADD_CANCELER_ITEM,
  canceler
})

export const clearCancelers = () => ({
  type: types.CLEAR_CANCELERS
})
