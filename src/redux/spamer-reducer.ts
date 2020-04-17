import { LogStatusType, ILog, ICaptcha } from '../types/types'
import bs from '../utils/BrowserStorage'

/* Action types */
const SET_SPAM_ON_RUN = 'vk_spamer_online/spamer/SET_SPAM_ON_RUN' as const
const SET_SPAM_ON_PAUSE = 'vk_spamer_online/spamer/SET_SPAM_ON_PAUSE' as const
const SET_START_TIMESTAMP = 'vk_spamer_online/spamer/SET_START_TIMESTAMP' as const
const SET_AUTO_SWITCH_TIME = 'vk_spamer_online/spamer/SET_AUTO_SWITCH_TIME' as const
const SET_ANTI_CAPTCHA_KEY = 'vk_spamer_online/spamer/SET_ANTI_CAPTCHA_KEY' as const
const ADD_LOG_ITEM = 'vk_spamer_online/spamer/ADD_LOG_ITEM' as const
const CHANGE_LOG_ITEM = 'vk_spamer_online/spamer/CHANGE_LOG_ITEM' as const
const REMOVE_LOG_ITEM = 'vk_spamer_online/spamer/REMOVE_LOG_ITEM' as const
const CLEAR_LOG = 'vk_spamer_online/spamer/CLEAR_LOG' as const
const SET_ADDRESSEE_INDEX = 'vk_spamer_online/spamer/SET_ADDRESSEE_INDEX' as const
const SET_SENDER_INDEX = 'vk_spamer_online/spamer/SET_SENDER_INDEX' as const
const SET_AUTO_SWITCH_REMAINING = 'vk_spamer_online/spamer/SET_AUTO_SWITCH_REMAINING' as const
const SET_SPAM_TIMER_ID = 'vk_spamer_online/spamer/SET_SPAM_TIMER_ID' as const
const SET_SENDER_TIMER_ID = 'vk_spamer_online/spamer/SET_SENDER_TIMER_ID' as const
const SET_AUTO_PAUSE_TIMER_ID = 'vk_spamer_online/spamer/SET_AUTO_PAUSE_TIMER_ID' as const
const ADD_CAPTCHA_ITEM = 'vk_spamer_online/spamer/ADD_CAPTCHA_ITEM' as const
const REMOVE_CAPTCHA_ITEM = 'vk_spamer_online/spamer/REMOVE_CAPTCHA_ITEM' as const
const CLEAR_CAPTCHA = 'vk_spamer_online/spamer/CLEAR_CAPTCHA' as const
const UNRAVEL_CAPTCHA_ITEM = 'vk_spamer_online/spamer/UNRAVEL_CAPTCHA_ITEM' as const

const localAutoSwitchTime = bs.local.get('fields.autoSwitchTime')
const autoSwitchTime = localAutoSwitchTime === 0 ? localAutoSwitchTime : localAutoSwitchTime || 300

const initialState = {
  spamOnRun: false,
  spamOnPause: false,
  startTimestamp: 0,
  settings: {
    autoSwitchTime: autoSwitchTime,
    antiCaptchaKey: bs.local.get('fields.antiCaptchaKey') || '',
  },
  logs: [
    {
      title: 'Приложение открыто',
      status: 'info' as LogStatusType,
      time: new Date().toLocaleTimeString(),
      key: `${Date.now()} Приложение открыто info`,
    },
  ] as Array<ILog>,
  initData: {
    addresseeIndex: 0,
    senderIndex: 0,
    autoSwitchRemaining: autoSwitchTime,
  },
  timers: {
    spamTimerID: 0,
    senderTimerID: 0,
    autoPauseTimerID: 0,
  },
  captcha: [] as Array<ICaptcha>,
}

type ActionTypes =
  ReturnType<typeof setSpamOnRun> |
  ReturnType<typeof setSpamOnPause> |
  ReturnType<typeof setStartTimestamp> |
  ReturnType<typeof setAutoSwitchTime> |
  ReturnType<typeof setAntiCaptchaKey> |
  ReturnType<typeof addLogItem> |
  ReturnType<typeof changeLogItem> |
  ReturnType<typeof removeLogItem> |
  ReturnType<typeof clearLog> |
  ReturnType<typeof setAddresseeIndex> |
  ReturnType<typeof setAutoSwitchRemaining> |
  ReturnType<typeof setSenderIndex> |
  ReturnType<typeof setSpamTimerID> |
  ReturnType<typeof setSenderTimerID> |
  ReturnType<typeof setAutoPauseTimerID> |
  ReturnType<typeof addCaptchaItem> |
  ReturnType<typeof removeCaptchaItem> |
  ReturnType<typeof clearCaptcha> |
  ReturnType<typeof unravelCaptchaItem>

function spamerReducer (state = initialState, action: ActionTypes): typeof initialState {
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

    case SET_START_TIMESTAMP:
      return {
        ...state,
        startTimestamp: action.seconds,
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
        logs: state.logs.map(log => log.key === action.key ? {
          ...log,
          title: action.data.title || log.title,
          status: action.data.status || log.status,
        } : log),
      }

    case REMOVE_LOG_ITEM:
      return {
        ...state,
        logs: state.logs.filter(log => log.key !== action.key),
      }

    case CLEAR_LOG:
      return {
        ...state,
        logs: [
          {
            title: 'Лог очищен',
            status: 'info',
            time: new Date().toLocaleTimeString(),
            key: `${Date.now()} Лог очищен info`,
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

    case SET_AUTO_SWITCH_REMAINING:
      return {
        ...state,
        initData: {
          ...state.initData,
          autoSwitchRemaining: action.seconds,
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

    case ADD_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: [
          ...state.captcha,
          { userID: action.userID, captchaImg: action.img, captchaKey: '', captchaSid: action.sid },
        ],
      }

    case REMOVE_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.filter(item => item.userID !== action.userID),
      }

    case CLEAR_CAPTCHA:
      return {
        ...state,
        captcha: [],
      }

    case UNRAVEL_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.map(item => item.userID === action.userID ? {
          ...item,
          captchaKey: action.key,
        } : item),
      }

    default:
      return state
  }
}

/* Action creators */
export const setSpamOnRun = (onRun: boolean) => ({
  type: SET_SPAM_ON_RUN,
  onRun,
})

export const setSpamOnPause = (onPause: boolean) => ({
  type: SET_SPAM_ON_PAUSE,
  onPause,
})

export const setStartTimestamp = (seconds: number) => ({
  type: SET_START_TIMESTAMP,
  seconds,
})

export const setAutoSwitchTime = (seconds: number) => ({
  type: SET_AUTO_SWITCH_TIME,
  seconds,
})

export const setAntiCaptchaKey = (key: string) => ({
  type: SET_ANTI_CAPTCHA_KEY,
  key,
})

export const addLogItem = (title: string, status: LogStatusType, key: string) => ({
  type: ADD_LOG_ITEM,
  item: {
    title,
    status,
    time: new Date().toLocaleTimeString(),
    key,
  },
})

export const changeLogItem = (key: string, data: { title?: string, status?: LogStatusType }) => ({
  type: CHANGE_LOG_ITEM,
  key,
  data,
})

export const removeLogItem = (key: string) => ({
  type: REMOVE_LOG_ITEM,
  key,
})

export const clearLog = () => ({
  type: CLEAR_LOG,
})

export const setAddresseeIndex = (index: number) => ({
  type: SET_ADDRESSEE_INDEX,
  index,
})

export const setSenderIndex = (index: number) => ({
  type: SET_SENDER_INDEX,
  index,
})

export const setAutoSwitchRemaining = (seconds: number) => ({
  type: SET_AUTO_SWITCH_REMAINING,
  seconds,
})

export const setSpamTimerID = (id: number) => ({
  type: SET_SPAM_TIMER_ID,
  id,
})

export const setSenderTimerID = (id: number) => ({
  type: SET_SENDER_TIMER_ID,
  id,
})

export const setAutoPauseTimerID = (id: number) => ({
  type: SET_AUTO_PAUSE_TIMER_ID,
  id,
})

export const addCaptchaItem = (img: string, sid: number, userID: number) => ({
  type: ADD_CAPTCHA_ITEM,
  img,
  sid,
  userID,
})

export const removeCaptchaItem = (userID: number) => ({
  type: REMOVE_CAPTCHA_ITEM,
  userID,
})

export const clearCaptcha = () => ({
  type: CLEAR_CAPTCHA,
})

export const unravelCaptchaItem = (userID: number, key: string) => ({
  type: UNRAVEL_CAPTCHA_ITEM,
  userID,
  key,
})

export default spamerReducer
