import storage from 'store2'
import { CancelTokenSource } from 'axios'
import * as types from './action-types'
import * as actions from './action-creators'
import { GetActionsType } from '../../store'
import { CaptchaType, LogStatusType, LogType } from '../../../types/types'

export const spamerReducerState = {
  spamOnRun: false,
  spamOnPause: false,
  startTimestamp: 0,
  logs: [
    {
      title: 'Приложение открыто',
      status: 'info' as LogStatusType,
      time: new Date().toLocaleTimeString(),
      key: `${Date.now()} Приложение открыто`
    }
  ] as LogType[],
  storedValues: {
    addresseeIndex: 0,
    senderIndex: 0,
    autoSwitchRemaining: storage.local.get('fields')?.autoSwitchTime || '300'
  },
  timers: {
    spamTimerId: 0,
    senderTimerId: 0,
    autoPauseTimerId: 0,
    notificationTimerId: 0
  },
  captcha: [] as CaptchaType[],
  cancelers: [] as CancelTokenSource[]
}

export type ActionsType = ReturnType<GetActionsType<typeof actions>>

const spamerReducer = (state = spamerReducerState, action: ActionsType): typeof spamerReducerState => {
  switch (action.type) {
    case types.SET_SPAM_ON_RUN:
      return {
        ...state,
        spamOnRun: action.onRun
      }

    case types.SET_SPAM_ON_PAUSE:
      return {
        ...state,
        spamOnPause: action.onPause
      }

    case types.SET_START_TIMESTAMP:
      return {
        ...state,
        startTimestamp: action.seconds
      }

    case types.ADD_LOG_ITEM:
      return {
        ...state,
        logs: [
          action.item,
          ...state.logs
        ]
      }

    case types.CHANGE_LOG_ITEM:
      return {
        ...state,
        logs: state.logs.map(log => log.key === action.key ? {
          ...log,
          title: action.data.title || log.title,
          status: action.data.status || log.status
        } : log)
      }

    case types.CLEAR_LOG:
      return {
        ...state,
        logs: [
          {
            title: 'Лог очищен',
            status: 'info',
            time: new Date().toLocaleTimeString(),
            key: `${Date.now()} Лог очищен info`
          }
        ]
      }

    case types.SET_ADDRESSEE_INDEX:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          addresseeIndex: action.index
        }
      }

    case types.SET_SENDER_INDEX:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          senderIndex: action.index
        }
      }

    case types.SET_AUTO_SWITCH_REMAINING:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          autoSwitchRemaining: action.seconds
        }
      }

    case types.SET_SPAM_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          spamTimerId: action.id
        }
      }

    case types.SET_SENDER_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          senderTimerId: action.id
        }
      }

    case types.SET_AUTO_PAUSE_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          autoPauseTimerId: action.id
        }
      }

    case types.SET_NOTIFICATION_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          notificationTimerId: action.id
        }
      }

    case types.ADD_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: [
          ...state.captcha,
          { userId: action.userId, captchaImg: action.img, captchaKey: '', captchaSid: action.sid }
        ]
      }

    case types.REMOVE_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.filter(item => item.userId !== action.userId)
      }

    case types.CLEAR_CAPTCHA:
      return {
        ...state,
        captcha: []
      }

    case types.UNRAVEL_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.map(item => item.userId === action.userId ? {
          ...item,
          captchaKey: action.key
        } : item)
      }

    case types.ADD_CANCELER_ITEM:
      return {
        ...state,
        cancelers: [
          ...state.cancelers,
          action.canceler
        ]
      }

    case types.CLEAR_CANCELERS:
      return {
        ...state,
        cancelers: []
      }

    default:
      return state
  }
}

export default spamerReducer
