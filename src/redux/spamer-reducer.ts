import { ILog, LogStatusType } from '../types/types'
import bs from '../utils/BrowserStorage'

/* Action types */
const SET_SPAM_ON_RUN = 'vk_spamer_online/spamer/SET_SPAM_ON_RUN'
const SET_SPAM_ON_PAUSE = 'vk_spamer_online/spamer/SET_SPAM_ON_PAUSE'
const SET_AUTO_SWITCH_TIME = 'vk_spamer_online/spamer/SET_AUTO_SWITCH_TIME'
const SET_ANTI_CAPTCHA_KEY = 'vk_spamer_online/spamer/SET_ANTI_CAPTCHA_KEY'
const ADD_LOG_ITEM = 'vk_spamer_online/spamer/ADD_LOG_ITEM'
const CHANGE_LOG_ITEM = 'vk_spamer_online/spamer/CHANGE_LOG_ITEM'
const CLEAR_LOG = 'vk_spamer_online/spamer/CLEAR_LOG'
const SET_ADDRESSEE_INDEX = 'vk_spamer_online/spamer/SET_ADDRESSEE_INDEX'
const SET_SENDER_INDEX = 'vk_spamer_online/spamer/SET_SENDER_INDEX'
const SET_SPAM_TIMER_ID = 'vk_spamer_online/spamer/SET_SPAM_TIMER_ID'
const SET_SENDER_TIMER_ID = 'vk_spamer_online/spamer/SET_SENDER_TIMER_ID'
const SET_AUTO_PAUSE_TIMER_ID = 'vk_spamer_online/spamer/SET_AUTO_PAUSE_TIMER_ID'

const initialState = {
  spamOnRun: false,
  spamOnPause: false,
  settings: {
    autoSwitchTime: bs.local.get('fields.autoSwitchTime') === '' ? 0 : 300,
    antiCaptchaKey: bs.local.get('fields.antiCaptchaKey') || '',
  },
  logs: [
    {
      title: 'Приложение открыто',
      status: 'info' as LogStatusType,
      loading: false,
      time: new Date().toLocaleTimeString(),
      key: Date.now().toString(),
    },
  ],
  initData: {
    addresseeIndex: 0,
    senderIndex: 0,
  },
  timers: {
    spamTimerID: 0,
    senderTimerID: 0,
    autoPauseTimerID: 0,
  },
}

type InitialStateType = typeof initialState
type ActionTypes =
  setSpamOnRunType |
  setAutoSwitchTimeType |
  setAntiCaptchaKeyType |
  addLogItemType |
  changeLogItemType |
  clearLogType |
  setSpamOnpauseType |
  setAddresseeIndexType |
  setSenderIndexType |
  setSpamTimerIDType |
  setSenderTimerIDType |
  setAutoPauseTimerIDType

function spamerReducer (state = initialState, action: ActionTypes): InitialStateType {
  switch (action.type) {
    case SET_SPAM_ON_RUN:
      return {
        ...state,
        spamOnRun: action.onRun,
      }

    case SET_SPAM_ON_PAUSE:
      return {
        ...state,
        spamOnPause: action.onPause,
      }

    case SET_AUTO_SWITCH_TIME:
      return {
        ...state,
        settings: {
          ...state.settings,
          autoSwitchTime: action.seconds,
        },
      }

    case SET_ANTI_CAPTCHA_KEY:
      return {
        ...state,
        settings: {
          ...state.settings,
          antiCaptchaKey: action.key,
        },
      }

    case ADD_LOG_ITEM:
      return {
        ...state,
        logs: [
          action.item,
          ...state.logs,
        ],
      }

    case CHANGE_LOG_ITEM:
      return {
        ...state,
        logs: [
          ...state.logs.map(log => log.key === action.key ? {
            ...log,
            title: action.data.title || log.title,
            status: action.data.status || log.status,
            loading: !!action.data.loading,
          } : log),
        ],
      }

    case CLEAR_LOG:
      return {
        ...state,
        logs: [
          {
            title: 'Лог очищен',
            status: 'info',
            loading: false,
            time: new Date().toLocaleTimeString(),
            key: Date.now().toString(),
          },
        ],
      }

    case SET_ADDRESSEE_INDEX:
      return {
        ...state,
        initData: {
          ...state.initData,
          addresseeIndex: action.index,
        },
      }

    case SET_SENDER_INDEX:
      return {
        ...state,
        initData: {
          ...state.initData,
          senderIndex: action.index,
        },
      }

    case SET_SPAM_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          spamTimerID: action.id,
        },
      }

    case SET_SENDER_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          senderTimerID: action.id,
        },
      }

    case SET_AUTO_PAUSE_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          autoPauseTimerID: action.id,
        },
      }

    default:
      return state
  }
}

/* Action creators */
type setSpamOnRunType = { type: typeof SET_SPAM_ON_RUN, onRun: boolean }
export const setSpamOnRun = (onRun: boolean): setSpamOnRunType => ({
  type: SET_SPAM_ON_RUN,
  onRun,
})

type setSpamOnpauseType = { type: typeof SET_SPAM_ON_PAUSE, onPause: boolean }
export const setSpamOnPause = (onPause: boolean): setSpamOnpauseType => ({
  type: SET_SPAM_ON_PAUSE,
  onPause,
})

type setAutoSwitchTimeType = { type: typeof SET_AUTO_SWITCH_TIME, seconds: number }
export const setAutoSwitchTime = (seconds: number): setAutoSwitchTimeType => ({
  type: SET_AUTO_SWITCH_TIME,
  seconds,
})

type setAntiCaptchaKeyType = { type: typeof SET_ANTI_CAPTCHA_KEY, key: string }
export const setAntiCaptchaKey = (key: string): setAntiCaptchaKeyType => ({
  type: SET_ANTI_CAPTCHA_KEY,
  key,
})

type addLogItemType = { type: typeof ADD_LOG_ITEM, item: ILog }
export const addLogItem = (title: string, status: LogStatusType, loading: boolean, key: string): addLogItemType => ({
  type: ADD_LOG_ITEM,
  item: {
    title,
    status,
    loading,
    time: new Date().toLocaleTimeString(),
    key,
  },
})

type changeLogItemType = { type: typeof CHANGE_LOG_ITEM, key: string, data: { title?: string, status?: LogStatusType, loading?: boolean } }
export const changeLogItem = (
  key: string,
  data: { title?: string, status?: LogStatusType, loading?: boolean },
): changeLogItemType => ({
  type: CHANGE_LOG_ITEM,
  key,
  data,
})

type clearLogType = { type: typeof CLEAR_LOG }
export const clearLog = (): clearLogType => ({
  type: CLEAR_LOG,
})

type setAddresseeIndexType = { type: typeof SET_ADDRESSEE_INDEX, index: number }
export const setAddresseeIndex = (index: number): setAddresseeIndexType => ({
  type: SET_ADDRESSEE_INDEX,
  index,
})

type setSenderIndexType = { type: typeof SET_SENDER_INDEX, index: number }
export const setSenderIndex = (index: number): setSenderIndexType => ({
  type: SET_SENDER_INDEX,
  index,
})

type setSpamTimerIDType = { type: typeof SET_SPAM_TIMER_ID, id: number }
export const setSpamTimerID = (id: number): setSpamTimerIDType => ({
  type: SET_SPAM_TIMER_ID,
  id,
})

type setSenderTimerIDType = { type: typeof SET_SENDER_TIMER_ID, id: number }
export const setSenderTimerID = (id: number): setSenderTimerIDType => ({
  type: SET_SENDER_TIMER_ID,
  id,
})

type setAutoPauseTimerIDType = { type: typeof SET_AUTO_PAUSE_TIMER_ID, id: number }
export const setAutoPauseTimerID = (id: number): setAutoPauseTimerIDType => ({
  type: SET_AUTO_PAUSE_TIMER_ID,
  id,
})

export default spamerReducer
