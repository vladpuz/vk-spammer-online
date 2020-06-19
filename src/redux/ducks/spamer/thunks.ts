import axios from 'axios'
import storage from 'store2'
import { ThunkAction } from 'redux-thunk'
import { createTask, getTaskResult } from '../../../api/anti-captcha'
import { leaveTheChat } from '../../../api/helpers'
import * as senders from '../../../api/senders'
import * as actions from './action-creators'
import { setCurrentSender, setIsEnabled } from '../accounts/action-creators'
import start from '../../../utils/spam/start'
import stop from '../../../utils/spam/stop'
import pause from '../../../utils/spam/pause'
import { proxyURL } from '../../../api/config'
import { StateType } from '../../store'
import { ActionsType } from './reducer'
import { AccountType, SpamValuesType } from '../../../types/types'

type ThunkActionsType = ActionsType | ReturnType<typeof setIsEnabled> | ReturnType<typeof setCurrentSender>
type ThunkType = ThunkAction<Promise<void>, StateType, unknown, ThunkActionsType>

export const send = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch, getState) => {
    const state = getState()
    const accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)
    const { spamOnRun, spamOnPause, storedValues, captcha, cancelers } = state.spamerReducer
    const token = accounts[storedValues.senderIndex].token
    const accountName = `${accounts[storedValues.senderIndex].profile.first_name} ${accounts[storedValues.senderIndex].profile.last_name}`
    const addressName = spamValues.addresses[storedValues.addresseeIndex]
    const userId = accounts[storedValues.senderIndex].profile.id
    const address = spamValues.addresses[storedValues.addresseeIndex]

    const captchaIndex = captcha.findIndex(item => item.userId === userId && item.captchaKey)
    const captchaOpt = { captchaKey: captcha[captchaIndex]?.captchaKey, captchaSid: captcha[captchaIndex]?.captchaSid }
    if (~captchaIndex) dispatch(actions.removeCaptchaItem(userId))

    const key = `Запрос обрабатывается ${accountName} ${addressName} ${userId} - ${Date.now()}`
    dispatch(actions.addLogItem('Запрос обрабатывается', 'pending', key))

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
        dispatch(actions.changeLogItem(key, {
          title: 'Запрос отменён',
          status: 'warning'
        }))
      } else {
        dispatch(actions.changeLogItem(key, {
          title: `Ошибка приложения - ${err}`,
          status: 'error'
        }))
      }
      return
    }

    // Если всё хорошо
    if (!res.error) {
      dispatch(actions.changeLogItem(key, {
        title: `Отправлено - ${addressName} от ${accountName}`,
        status: 'success'
      }))
      return
    }

    // Обработка капчи
    if (res.error.error_msg === 'CaptchaType needed') {
      if (spamValues.captchaMode === 'Антикапча') {
        cancelers.forEach((source) => { source.cancel() })
        dispatch(actions.addCaptchaItem(res.error.captcha_img, res.error.captcha_sid, userId))
        dispatch(actions.clearCancelers())
        dispatch(actions.changeLogItem(key, {
          title: `Потребовалась капча для аккаунта ${accountName}`,
          status: 'warning'
        }))

        if (!spamOnPause) {
          pause(
            actions.addLogItem(
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
              dispatch(actions.unravelCaptchaItem(userId, getTaskRes.solution.text))
              if (getState().spamerReducer.spamOnRun) {
                start(spamValues, actions.addLogItem(
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
        dispatch(actions.clearCancelers())
        dispatch(
          actions.changeLogItem(key, { title: `Потребовалась капча для аккаунта ${accountName}`, status: 'warning' }))
        dispatch(actions.addCaptchaItem(res.error.captcha_img, res.error.captcha_sid, userId))
        if (!getState().spamerReducer.spamOnPause) {
          pause(
            actions.addLogItem(
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
          dispatch(actions.changeLogItem(key, {
            title: `Потребовалась капча, аккаунт ${accountName} был выключен`,
            status: 'warning'
          }))
          cancelers.forEach((source) => { source.cancel() })
          dispatch(actions.clearCancelers())
        }

        const newAccounts = storage.local.get('accounts').map((account: AccountType) => {
          return account.profile.id === userId ? {
            ...account,
            isEnabled: false
          } : account
        })
        storage.local.set('accounts', newAccounts)

        dispatch(setIsEnabled(userId, false))
        dispatch(setCurrentSender(accounts[nextSenderIndex].profile.id))

        accounts[storedValues.senderIndex].isEnabled = false
        if (accounts.every(account => !account.isEnabled) && spamOnRun) {
          stop(
            actions.addLogItem(
              'Все аккаунты были выключены, спам остановлен',
              'info',
              `Все аккаунты были выключены, спам остановлен - ${Date.now()}`
            ),
            spamValues.autoSwitchTime
          )
        }
      }
    } else {
      dispatch(actions.changeLogItem(key, {
        title: `Ошибка вк - ${res.error.error_msg}`,
        status: 'error'
      }))
    }
  }
}
