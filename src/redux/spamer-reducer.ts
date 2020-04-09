import { ILog, logStateType } from '../types/types'
import bs from '../utils/BrowserStorage'

/* Action types */
const SET_SPAM_IS_RUN = 'vk_spamer_online/spamer/SET_SPAM_IS_RUN'
const SET_SPAM_ON_PAUSE = 'vk_spamer_online/spamer/SET_SPAM_ON_PAUSE'
const SET_AUTO_SWITCH_TIME = 'vk_spamer_online/spamer/SET_AUTO_SWITCH_TIME'
const SET_ANTI_CAPTCHA_KEY = 'vk_spamer_online/spamer/SET_ANTI_CAPTCHA_KEY'
const ADD_LOG_ITEM = 'vk_spamer_online/spamer/ADD_LOG_ITEM'
const CLEAR_LOG = 'vk_spamer_online/spamer/CLEAR_LOG'
const SET_CURRENT_ADDRESSEE_INDEX = 'vk_spamer_online/spamer/SET_CURRENT_ADDRESSEE_INDEX'
const SET_CURRENT_SENDER_INDEX = 'vk_spamer_online/spamer/SET_CURRENT_SENDER_INDEX'
const SET_AUTO_PAUSE_TIMEOUT = 'vk_spamer_online/spamer/SET_AUTO_PAUSE_TIMEOUT'
const SET_SPAM_TIMER_ID = 'vk_spamer_online/spamer/SET_SPAM_TIMER_ID'
const SET_SENDER_TIMER_ID = 'vk_spamer_online/spamer/SET_SENDER_TIMER_ID'
const ADD_SEND_OPERATION = 'vk_spamer_online/spamer/ADD_SEND_OPERATION'

const initialState = {
  spamIsRun: false,
  spamOnPause: false,
  settings: {
    autoSwitchTime: bs.local.get('fields.autoSwitchTime') || '300',
    antiCaptchaKey: bs.local.get('fields.antiCaptchaKey') || ''
  },
  logs: [{
    title: 'Приложение открыто',
    state: 'info' as logStateType,
    time: new Date().toLocaleTimeString(),
    key: Date.now()
  }],
  pauseData: {
    currentAddresseeIndex: 0,
    currentSenderIndex: 0,
    autoPauseTimeout: 0
  },
  spamTimerID: 0,
  senderTimerID: 0,
  sendOperations: [] as Promise<any>[]
}

type InitialStateType = typeof initialState
type ActionTypes =
  setSpamIsRunType |
  setAutoSwitchTimeType |
  setAntiCaptchaKeyType |
  addLogItemType |
  clearLogType |
  setSpamOnpauseType |
  setCurrentAddresseeIndexType |
  setCurrentSenderIndexType |
  setAutoPauseTimeoutType |
  setSpamTimerIDType |
  setSenderTimerIDType |
  addSendOperationType

function spamerReducer (state = initialState, action: ActionTypes): InitialStateType {
  switch (action.type) {
    case SET_SPAM_IS_RUN:
      return {
        ...state,
        spamIsRun: action.isRun
      }

    case SET_SPAM_ON_PAUSE:
      return {
        ...state,
        spamOnPause: action.onPause
      }

    case SET_AUTO_SWITCH_TIME:
      return {
        ...state,
        settings: {
          ...state.settings,
          autoSwitchTime: action.seconds
        }
      }

    case SET_ANTI_CAPTCHA_KEY:
      return {
        ...state,
        settings: {
          ...state.settings,
          antiCaptchaKey: action.key
        }
      }

    case ADD_LOG_ITEM:
      return {
        ...state,
        logs: [
          action.item,
          ...state.logs
        ]
      }

    case CLEAR_LOG:
      return {
        ...state,
        logs: [
          { title: 'Лог очищен', state: 'info', time: new Date().toLocaleTimeString(), key: Date.now() }
        ]
      }

    case SET_CURRENT_ADDRESSEE_INDEX:
      return {
        ...state,
        pauseData: {
          ...state.pauseData,
          currentAddresseeIndex: action.index
        }
      }

    case SET_CURRENT_SENDER_INDEX:
      return {
        ...state,
        pauseData: {
          ...state.pauseData,
          currentSenderIndex: action.index
        }
      }

    case SET_AUTO_PAUSE_TIMEOUT:
      return {
        ...state,
        pauseData: {
          ...state.pauseData,
          autoPauseTimeout: action.minutes
        }
      }

    case SET_SPAM_TIMER_ID:
      return {
        ...state,
        spamTimerID: action.id
      }

    case SET_SENDER_TIMER_ID:
      return {
        ...state,
        senderTimerID: action.id
      }

    case ADD_SEND_OPERATION:
      return {
        ...state,
        sendOperations: [
          ...state.sendOperations,
          action.promise
        ]
      }

    default:
      return state
  }
}

/* Action creators */
type setSpamIsRunType = { type: typeof SET_SPAM_IS_RUN, isRun: boolean }
export const setSpamIsRun = (isRun: boolean): setSpamIsRunType => ({
  type: SET_SPAM_IS_RUN,
  isRun
})

type setSpamOnpauseType = { type: typeof SET_SPAM_ON_PAUSE, onPause: boolean }
export const setSpamOnpause = (onPause: boolean): setSpamOnpauseType => ({
  type: SET_SPAM_ON_PAUSE,
  onPause
})

type setAutoSwitchTimeType = { type: typeof SET_AUTO_SWITCH_TIME, seconds: number }
export const setAutoSwitchTime = (seconds: number): setAutoSwitchTimeType => ({
  type: SET_AUTO_SWITCH_TIME,
  seconds
})

type setAntiCaptchaKeyType = { type: typeof SET_ANTI_CAPTCHA_KEY, key: string }
export const setAntiCaptchaKey = (key: string): setAntiCaptchaKeyType => ({
  type: SET_ANTI_CAPTCHA_KEY,
  key
})

type addLogItemType = { type: typeof ADD_LOG_ITEM, item: ILog }
export const addLogItem = (title: string, state: logStateType): addLogItemType => ({
  type: ADD_LOG_ITEM,
  item: {
    title,
    state,
    time: new Date().toLocaleTimeString(),
    key: Date.now()
  }
})

type clearLogType = { type: typeof CLEAR_LOG }
export const clearLog = (): clearLogType => ({
  type: CLEAR_LOG,
})

type setCurrentAddresseeIndexType = { type: typeof SET_CURRENT_ADDRESSEE_INDEX, index: number }
export const setCurrentAddresseeIndex = (index: number): setCurrentAddresseeIndexType => ({
  type: SET_CURRENT_ADDRESSEE_INDEX,
  index
})

type setCurrentSenderIndexType = { type: typeof SET_CURRENT_SENDER_INDEX, index: number }
export const setCurrentSenderIndex = (index: number): setCurrentSenderIndexType => ({
  type: SET_CURRENT_SENDER_INDEX,
  index
})

type setAutoPauseTimeoutType = { type: typeof SET_AUTO_PAUSE_TIMEOUT, minutes: number }
export const setAutoPauseTimeout = (minutes: number): setAutoPauseTimeoutType => ({
  type: SET_AUTO_PAUSE_TIMEOUT,
  minutes
})

type setSpamTimerIDType = { type: typeof SET_SPAM_TIMER_ID, id: number }
export const setSpamTimerID = (id: number): setSpamTimerIDType => ({
  type: SET_SPAM_TIMER_ID,
  id
})

type setSenderTimerIDType = { type: typeof SET_SENDER_TIMER_ID, id: number }
export const setSenderTimerID = (id: number): setSenderTimerIDType => ({
  type: SET_SENDER_TIMER_ID,
  id
})

type addSendOperationType = { type: typeof ADD_SEND_OPERATION, promise: Promise<any> }
export const addSendOperation = (promise: Promise<any>): addSendOperationType => ({
  type: ADD_SEND_OPERATION,
  promise
})

export default spamerReducer
