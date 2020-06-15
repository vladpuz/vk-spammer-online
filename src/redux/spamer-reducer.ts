import axios, { CancelTokenSource } from 'axios'
import storage from 'store2'
import { ThunkAction } from 'redux-thunk'
import { RootReducerType } from './store'
import { setCurrentSender, setIsEnabled } from './accounts-reducer'
import pause from '../utils/spam/pause'
import stop from '../utils/spam/stop'
import { leaveTheChat } from '../api/helpers'
import * as senders from '../api/send'
import { LogStatusType, ILog, ICaptcha, IAccount, ISpamValues } from '../types/app-types'
import { createTask, getTaskResult } from '../api/anti-captcha'
import start from '../utils/spam/start'
import { proxyURL } from '../api/config'

/* Action types */
const SET_SPAM_ON_RUN = 'vk-spam-online/spam/SET_SPAM_ON_RUN' as const
const SET_SPAM_ON_PAUSE = 'vk-spam-online/spam/SET_SPAM_ON_PAUSE' as const
const SET_START_TIMESTAMP = 'vk-spam-online/spam/SET_START_TIMESTAMP' as const
const ADD_LOG_ITEM = 'vk-spam-online/spam/ADD_LOG_ITEM' as const
const CHANGE_LOG_ITEM = 'vk-spam-online/spam/CHANGE_LOG_ITEM' as const
const REMOVE_LOG_ITEM = 'vk-spam-online/spam/REMOVE_LOG_ITEM' as const
const CLEAR_LOG = 'vk-spam-online/spam/CLEAR_LOG' as const
const SET_ADDRESSEE_INDEX = 'vk-spam-online/spam/SET_ADDRESSEE_INDEX' as const
const SET_SENDER_INDEX = 'vk-spam-online/spam/SET_SENDER_INDEX' as const
const SET_AUTO_SWITCH_REMAINING = 'vk-spam-online/spam/SET_AUTO_SWITCH_REMAINING' as const
const SET_SPAM_TIMER_ID = 'vk-spam-online/spam/SET_SPAM_TIMER_Id' as const
const SET_SENDER_TIMER_ID = 'vk-spam-online/spam/SET_SENDER_TIMER_Id' as const
const SET_AUTO_PAUSE_TIMER_ID = 'vk-spam-online/spam/SET_AUTO_PAUSE_TIMER_Id' as const
const SET_NOTIFICATION_TIMER_ID = 'vk-spam-online/spam/SET_NOTIFICATION_TIMER_Id' as const
const ADD_CAPTCHA_ITEM = 'vk-spam-online/spam/ADD_CAPTCHA_ITEM' as const
const REMOVE_CAPTCHA_ITEM = 'vk-spam-online/spam/REMOVE_CAPTCHA_ITEM' as const
const CLEAR_CAPTCHA = 'vk-spam-online/spam/CLEAR_CAPTCHA' as const
const UNRAVEL_CAPTCHA_ITEM = 'vk-spam-online/spam/UNRAVEL_CAPTCHA_ITEM' as const
const ADD_CANCELER_ITEM = 'vk-spam-online/spam/ADD_CANCELER_ITEM' as const
const CLEAR_CANCELERS = 'vk-spam-online/spam/CLEAR_CANCELERS' as const

const initialState = {
  spamOnRun: false,
  spamOnPause: false,
  startTimestamp: 0,
  logs: [
    {
      title: 'Приложение открыто',
      status: 'info' as LogStatusType,
      time: new Date().toLocaleTimeString(),
      key: `${Date.now()} Приложение открыто info`
    }
  ] as Array<ILog>,
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
  captcha: [] as Array<ICaptcha>,
  cancelers: [] as Array<CancelTokenSource>
}

type ActionTypes =
  ReturnType<typeof setSpamOnRun> |
  ReturnType<typeof setSpamOnPause> |
  ReturnType<typeof setStartTimestamp> |
  ReturnType<typeof addLogItem> |
  ReturnType<typeof changeLogItem> |
  ReturnType<typeof removeLogItem> |
  ReturnType<typeof clearLog> |
  ReturnType<typeof setAddresseeIndex> |
  ReturnType<typeof setAutoSwitchRemaining> |
  ReturnType<typeof setSenderIndex> |
  ReturnType<typeof setSpamTimerId> |
  ReturnType<typeof setSenderTimerId> |
  ReturnType<typeof setAutoPauseTimerId> |
  ReturnType<typeof setNotificationTimerId> |
  ReturnType<typeof addCaptchaItem> |
  ReturnType<typeof removeCaptchaItem> |
  ReturnType<typeof clearCaptcha> |
  ReturnType<typeof unravelCaptchaItem> |
  ReturnType<typeof addCancelerItem> |
  ReturnType<typeof clearCancelers>

function spamerReducer (state = initialState, action: ActionTypes): typeof initialState {
  switch (action.type) {
    case SET_SPAM_ON_RUN:
      return {
        ...state,
        spamOnRun: action.onRun
      }

    case SET_SPAM_ON_PAUSE:
      return {
        ...state,
        spamOnPause: action.onPause
      }

    case SET_START_TIMESTAMP:
      return {
        ...state,
        startTimestamp: action.seconds
      }

    case ADD_LOG_ITEM:
      return {
        ...state,
        logs: [
          action.item,
          ...state.logs
        ]
      }

    case CHANGE_LOG_ITEM:
      return {
        ...state,
        logs: state.logs.map(log => log.key === action.key ? {
          ...log,
          title: action.data.title || log.title,
          status: action.data.status || log.status
        } : log)
      }

    case REMOVE_LOG_ITEM:
      return {
        ...state,
        logs: state.logs.filter(log => log.key !== action.key)
      }

    case CLEAR_LOG:
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

    case SET_ADDRESSEE_INDEX:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          addresseeIndex: action.index
        }
      }

    case SET_SENDER_INDEX:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          senderIndex: action.index
        }
      }

    case SET_AUTO_SWITCH_REMAINING:
      return {
        ...state,
        storedValues: {
          ...state.storedValues,
          autoSwitchRemaining: action.seconds
        }
      }

    case SET_SPAM_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          spamTimerId: action.id
        }
      }

    case SET_SENDER_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          senderTimerId: action.id
        }
      }

    case SET_AUTO_PAUSE_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          autoPauseTimerId: action.id
        }
      }

    case SET_NOTIFICATION_TIMER_ID:
      return {
        ...state,
        timers: {
          ...state.timers,
          notificationTimerId: action.id
        }
      }

    case ADD_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: [
          ...state.captcha,
          { userId: action.userId, captchaImg: action.img, captchaKey: '', captchaSid: action.sid }
        ]
      }

    case REMOVE_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.filter(item => item.userId !== action.userId)
      }

    case CLEAR_CAPTCHA:
      return {
        ...state,
        captcha: []
      }

    case UNRAVEL_CAPTCHA_ITEM:
      return {
        ...state,
        captcha: state.captcha.map(item => item.userId === action.userId ? {
          ...item,
          captchaKey: action.key
        } : item)
      }

    case ADD_CANCELER_ITEM:
      return {
        ...state,
        cancelers: [
          ...state.cancelers,
          action.canceler
        ]
      }

    case CLEAR_CANCELERS:
      return {
        ...state,
        cancelers: []
      }

    default:
      return state
  }
}

/* Action creators */
export const setSpamOnRun = (onRun: boolean) => ({
  type: SET_SPAM_ON_RUN,
  onRun
})

export const setSpamOnPause = (onPause: boolean) => ({
  type: SET_SPAM_ON_PAUSE,
  onPause
})

export const setStartTimestamp = (seconds: number) => ({
  type: SET_START_TIMESTAMP,
  seconds
})

export const addLogItem = (title: string, status: LogStatusType, key: string) => ({
  type: ADD_LOG_ITEM,
  item: {
    title,
    status,
    time: new Date().toLocaleTimeString(),
    key
  }
})

export const changeLogItem = (key: string, data: { title?: string, status?: LogStatusType }) => ({
  type: CHANGE_LOG_ITEM,
  key,
  data
})

export const removeLogItem = (key: string) => ({
  type: REMOVE_LOG_ITEM,
  key
})

export const clearLog = () => ({
  type: CLEAR_LOG
})

export const setAddresseeIndex = (index: number) => ({
  type: SET_ADDRESSEE_INDEX,
  index
})

export const setSenderIndex = (index: number) => ({
  type: SET_SENDER_INDEX,
  index
})

export const setAutoSwitchRemaining = (seconds: number) => ({
  type: SET_AUTO_SWITCH_REMAINING,
  seconds
})

export const setSpamTimerId = (id: number) => ({
  type: SET_SPAM_TIMER_ID,
  id
})

export const setSenderTimerId = (id: number) => ({
  type: SET_SENDER_TIMER_ID,
  id
})

export const setAutoPauseTimerId = (id: number) => ({
  type: SET_AUTO_PAUSE_TIMER_ID,
  id
})

export const setNotificationTimerId = (id: number) => ({
  type: SET_NOTIFICATION_TIMER_ID,
  id
})

export const addCaptchaItem = (img: string, sid: number, userId: number) => ({
  type: ADD_CAPTCHA_ITEM,
  img,
  sid,
  userId
})

export const removeCaptchaItem = (userId: number) => ({
  type: REMOVE_CAPTCHA_ITEM,
  userId
})

export const clearCaptcha = () => ({
  type: CLEAR_CAPTCHA
})

export const unravelCaptchaItem = (userId: number, key: string) => ({
  type: UNRAVEL_CAPTCHA_ITEM,
  userId,
  key
})

export const addCancelerItem = (canceler: any) => ({
  type: ADD_CANCELER_ITEM,
  canceler
})

export const clearCancelers = () => ({
  type: CLEAR_CANCELERS
})

/* Thunk creators */
type ThunkActionTypes = ActionTypes | ReturnType<typeof setIsEnabled> | ReturnType<typeof setCurrentSender>
type ThunkType = ThunkAction<Promise<any>, RootReducerType, unknown, ThunkActionTypes>

export const send = (spamValues: ISpamValues): ThunkType => {
  return async (dispatch, getState) => {
    const state = getState()
    const accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)
    const { spamOnRun, spamOnPause, storedValues, captcha, cancelers } = state.spamerReducer
    const token = accounts[storedValues.senderIndex].token
    const accountName = `${accounts[storedValues.senderIndex].profileInfo.first_name} ${accounts[storedValues.senderIndex].profileInfo.last_name}`
    const addressName = spamValues.addresses[storedValues.addresseeIndex]
    const userId = accounts[storedValues.senderIndex].profileInfo.id
    const address = spamValues.addresses[storedValues.addresseeIndex]

    const captchaIndex = captcha.findIndex(item => item.userId === userId && item.captchaKey)
    const captchaOpt = { captchaKey: captcha[captchaIndex]?.captchaKey, captchaSid: captcha[captchaIndex]?.captchaSid }
    if (~captchaIndex) dispatch(removeCaptchaItem(userId))

    const key = `Запрос обрабатывается ${accountName} ${addressName} ${userId} - ${Date.now()}`
    dispatch(addLogItem('Запрос обрабатывается', 'pending', key))

    let res

    // Выполнение запроса
    try {
      switch (spamValues.spamMode) {
        case 'pm':
          res = await senders.sendToUser(token, address, spamValues.message, spamValues.attachment, captchaOpt)
          break
        case 'chat':
          res = await senders.sendToChat(token, +address, spamValues.message, spamValues.attachment, captchaOpt)
          break
        case 'chatAutoExit':
          res = await senders.sendToChat(token, +address, spamValues.message, spamValues.attachment, captchaOpt)
          await leaveTheChat(token, +address, userId)
          break
        case 'usersWalls':
          res = await senders.postToUser(token, +address, spamValues.message, spamValues.attachment, captchaOpt)
          break
        case 'groupsWalls':
          res = await senders.postToGroup(token, +address, spamValues.message, spamValues.attachment, captchaOpt)
          break
        case 'comments':
          res = await senders.sendToComments(token, address, spamValues.message, spamValues.attachment, captchaOpt)
          break
        case 'discussions':
          res = await senders.sendToDiscussions(token, address, spamValues.message, spamValues.attachment,
            captchaOpt)
          break
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        dispatch(changeLogItem(key, {
          title: 'Запрос отменён',
          status: 'warning'
        }))
      } else {
        dispatch(changeLogItem(key, {
          title: `Ошибка приложения - ${err}`,
          status: 'error'
        }))
      }
      return
    }

    // Если всё хорошо
    if (!res.error) {
      dispatch(changeLogItem(key, {
        title: `Отправлено - ${addressName} от ${accountName}`,
        status: 'success'
      }))
      return
    }

    // Обработка капчи
    if (res.error.error_msg === 'Captcha needed') {
      if (spamValues.captchaMode === 'Антикапча') {
        cancelers.forEach((source) => { source.cancel() })
        dispatch(addCaptchaItem(res.error.captcha_img, res.error.captcha_sid, userId))
        dispatch(clearCancelers())
        dispatch(changeLogItem(key, {
          title: `Потребовалась капча для аккаунта ${accountName}`,
          status: 'warning'
        }))

        if (!spamOnPause) {
          pause(
            addLogItem(
              'Капча разгадывается…',
              'info',
              `Капча разгадывается… - ${Date.now()}`
            ),
            spamValues.autoSwitchTime
          )
        }

        const blob = (await axios.get(proxyURL + res.error.captcha_img, { responseType: 'blob' })).data
        const reader = new FileReader()

        reader.readAsDataURL(blob)
        reader.onload = async () => {
          const body = String(reader.result).split(',')[1]

          const createTaskRes = await createTask(spamValues.antiCaptchaKey, body)
          console.log(createTaskRes)

          const tick = async () => {
            const getTaskRes = await getTaskResult(spamValues.antiCaptchaKey, createTaskRes.taskId)
            console.log(getTaskRes)
            if (getTaskRes.status === 'ready') {
              dispatch(unravelCaptchaItem(userId, getTaskRes.solution.text))
              if (getState().spamerReducer.spamOnRun) {
                start(spamValues, addLogItem(
                  'Капча разгадана, спам продолжен',
                  'info',
                  `Капча разгадана, спам продолжен - ${Date.now()}`
                ))
              }
            } else {
              setTimeout(tick, 1000)
            }
          }

          setTimeout(tick, 5000)
        }
      } else if (spamValues.captchaMode === 'Показывать капчу') {
        cancelers.forEach((source) => { source.cancel() })
        dispatch(clearCancelers())
        dispatch(changeLogItem(key, { title: `Потребовалась капча для аккаунта ${accountName}`, status: 'warning' }))
        dispatch(addCaptchaItem(res.error.captcha_img, res.error.captcha_sid, userId))
        if (!getState().spamerReducer.spamOnPause) {
          pause(
            addLogItem(
              'Требуется капча, спам приостановлен',
              'info',
              `Требуется капча, спам приостановлен - ${Date.now()}`
            ),
            spamValues.autoSwitchTime
          )
        }
      } else if (spamValues.captchaMode === 'Игнорировать капчу') {
        const nextSenderIndex = (storedValues.senderIndex + 1 === accounts.length) ? 0 : storedValues.senderIndex + 1

        if (accounts[storedValues.senderIndex].isEnabled) {
          dispatch(changeLogItem(key, {
            title: `Потребовалась капча, аккаунт ${accountName} был выключен`,
            status: 'warning'
          }))
          cancelers.forEach((source) => { source.cancel() })
          dispatch(clearCancelers())
        }

        const newAccounts = storage.local.get('accounts').map((account: IAccount) => {
          return account.profileInfo.id === userId ? {
            ...account,
            isEnabled: false
          } : account
        })
        storage.local.set('accounts', newAccounts)

        dispatch(setIsEnabled(userId, false))
        dispatch(setCurrentSender(accounts[nextSenderIndex].profileInfo.id))

        accounts[storedValues.senderIndex].isEnabled = false
        if (accounts.every(account => !account.isEnabled) && spamOnRun) {
          stop(
            addLogItem(
              'Все аккаунты были выключены, спам остановлен',
              'info',
              `Все аккаунты были выключены, спам остановлен - ${Date.now()}`
            ),
            spamValues.autoSwitchTime
          )
        }
      }
    } else {
      dispatch(changeLogItem(key, {
        title: `Ошибка вк - ${res.error.error_msg}`,
        status: 'error'
      }))
    }
  }
}

export default spamerReducer
