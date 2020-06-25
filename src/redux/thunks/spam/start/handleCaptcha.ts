import axios from 'axios'
import storage from 'store2'
import start from './start'
import stop from '../stop/stop'
import pause from '../pause/pause'
import { createTask, getTaskResult, CreateTaskRes, GetTaskResultRes } from '../../../../api/anti-captcha'
import {
  addCaptchaItem,
  addLogItem,
  changeLogItem,
  clearCancelers,
  unravelCaptchaItem
} from '../../../ducks/spamer/action-creators'
import { setCurrentSender, setIsEnabled } from '../../../ducks/accounts/action-creators'
import ApiError, { VKErrorRes } from '../../../../api/ApiError'
import { proxyURL } from '../../../../api/config'
import { ThunkType } from '../../../store'
import { AccountType, SpamValuesType } from '../../../../types/types'

// Обрабатываем ошибку капчи
const handleCaptcha = (spamValues: SpamValuesType, err: ApiError<VKErrorRes>, key: string): ThunkType => {
  return async (dispatch, getState) => {
    const { captchaMode, autoSwitchTime, antiCaptchaKey } = spamValues
    const { storedValues, cancelers } = getState().spamerReducer
    const accounts = getState().accountsReducer.accounts.filter(account => account.isEnabled)
    const { captcha_img, captcha_sid } = err.response.data.error

    const sender = accounts[storedValues.senderIndex]
    const senderId = accounts[storedValues.senderIndex].profile.id
    const senderName = `${sender.profile.first_name} ${sender.profile.last_name}`

    if (captchaMode === 'Антикапча') {
      cancelers.forEach((source) => { source.cancel() })
      dispatch(clearCancelers())

      dispatch(changeLogItem(key, { title: `Потребовалась капча для аккаунта ${senderName}`, status: 'warning' }))
      dispatch(addCaptchaItem(captcha_img, captcha_sid, senderId))

      if (!getState().spamerReducer.spamOnPause && getState().spamerReducer.spamOnRun) {
        await dispatch(pause(addLogItem(
          'Капча разгадывается…',
          'info',
          `Капча разгадывается… - ${Date.now()}`
        ), autoSwitchTime))
      }

      const blob = (await axios.get(proxyURL + captcha_img, { responseType: 'blob' })).data
      const reader = new FileReader()

      reader.readAsDataURL(blob)
      reader.onload = async () => {
        const base64 = String(reader.result).split(',')[1]

        let createTaskResponse: CreateTaskRes
        try {
          createTaskResponse = await createTask(antiCaptchaKey, base64)
          // console.log(createTaskResponse)
        } catch (err) {
          if (err instanceof ApiError) {
            dispatch(changeLogItem(key, {
              title: `Ошибка АнтиКапчи - ${err.response.data.errorDescription}`,
              status: 'error'
            }))
            return
          }
        }

        const requestResult = async () => {
          let getTaskResponse: GetTaskResultRes
          try {
            getTaskResponse = await getTaskResult(antiCaptchaKey, createTaskResponse.taskId)
            // console.log(getTaskResponse)

            if (getTaskResponse.status === 'ready') {
              dispatch(unravelCaptchaItem(senderId, getTaskResponse.solution.text))
              await dispatch(start(addLogItem(
                `Капча разгадана - ${getTaskResponse.solution.text}, спам продолжен`,
                'info',
                `Капча разгадана - ${getTaskResponse.solution.text}, спам продолжен - ${Date.now()}`
              ), {
                ...spamValues,
                autoPauseTimeout: +spamValues.autoPauseTimeout,
                autoSwitchTime: +spamValues.autoSwitchTime
              }))
            } else {
              setTimeout(requestResult, 1000)
            }
          } catch (err) {
            if (err instanceof ApiError) {
              dispatch(changeLogItem(key, {
                title: `Ошибка АнтиКапчи - ${err.response.data.errorDescription}`,
                status: 'error'
              }))
            }
          }
        }

        setTimeout(requestResult, 5000)
      }
    } else if (captchaMode === 'Показывать капчу') {
      cancelers.forEach((source) => { source.cancel() })
      dispatch(clearCancelers())

      dispatch(changeLogItem(key, { title: `Потребовалась капча для аккаунта ${senderName}`, status: 'warning' }))
      dispatch(addCaptchaItem(captcha_img, captcha_sid, senderId))

      if (!getState().spamerReducer.spamOnPause && getState().spamerReducer.spamOnRun) {
        await dispatch(pause(addLogItem(
          'Требуется капча, спам приостановлен',
          'info',
          `Требуется капча, спам приостановлен - ${Date.now()}`
        ), autoSwitchTime))
      }
    } else if (captchaMode === 'Игнорировать капчу') {
      cancelers.forEach((source) => { source.cancel() })
      dispatch(clearCancelers())

      const nextSenderIndex = (storedValues.senderIndex + 1 === accounts.length) ? 0 : storedValues.senderIndex + 1
      const nextSender = accounts[nextSenderIndex]

      dispatch(changeLogItem(key, {
        title: `Потребовалась капча, аккаунт ${senderName} был выключен`,
        status: 'warning'
      }))
      dispatch(setIsEnabled(senderId, false))
      dispatch(setCurrentSender(nextSender.profile.id))

      const newAccounts = storage.local.get('accounts').map((account: AccountType) => {
        return account.profile.id === senderId ? {
          ...account,
          isEnabled: false
        } : account
      })
      storage.local.set('accounts', newAccounts)

      sender.isEnabled = false
      if (accounts.every(account => !account.isEnabled) && getState().spamerReducer.spamOnRun) {
        await dispatch(stop(addLogItem(
          'Все аккаунты были выключены, спам остановлен',
          'info',
          `Все аккаунты были выключены, спам остановлен - ${Date.now()}`
        ), autoSwitchTime))
      }
    }
  }
}

export default handleCaptcha
