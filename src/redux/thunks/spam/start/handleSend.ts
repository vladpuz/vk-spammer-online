import axios from 'axios'
import handleCaptcha from './handleCaptcha'
import ApiError from '../../../../api/ApiError'
import { leaveTheChat } from '../../../../api/helpers'
import * as senders from '../../../../api/senders'
import { addCancelerItem, addLogItem, changeLogItem, removeCaptchaItem } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Делаем и обрабатываем запрос
const handleSend = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch, getState) => {
    const { attachment, spamMode, addresses } = spamValues
    const message = spamValues.message.replaceAll('\n', '%0A')
    const { storedValues, captcha } = getState().spamerReducer
    const accounts = getState().accountsReducer.accounts.filter(account => account.isEnabled)

    const sender = accounts[storedValues.senderIndex]
    const senderName = `${sender.profile.first_name} ${sender.profile.last_name}`
    const address = addresses[storedValues.addresseeIndex]

    const key = `Запрос обрабатывается ${senderName} ${address} ${sender.profile.id} - ${Date.now()}`
    dispatch(addLogItem('Запрос обрабатывается', 'pending', key))

    const captchaIndex = captcha.findIndex(captcha => captcha.userId === sender.profile.id && captcha.captchaKey)
    const captchaOpt = { captchaKey: captcha[captchaIndex]?.captchaKey, captchaSid: captcha[captchaIndex]?.captchaSid }
    if (~captchaIndex) dispatch(removeCaptchaItem(sender.profile.id))

    // Выполнение запроса
    const source = axios.CancelToken.source()
    const cancelToken = source.token
    dispatch(addCancelerItem(source))

    try {
      switch (spamMode) {
        case 'pm':
          await senders.sendToUser(sender.token, address, message, attachment, cancelToken, captchaOpt)
          break
        case 'chat':
          await senders.sendToChat(sender.token, +address, message, attachment, cancelToken, captchaOpt)
          break
        case 'chatAutoExit':
          await senders.sendToChat(sender.token, +address, message, attachment, cancelToken, captchaOpt)
          await leaveTheChat(sender.token, +address, sender.profile.id)
          break
        case 'usersWalls':
          await senders.postToUser(sender.token, +address, message, attachment, cancelToken, captchaOpt)
          break
        case 'groupsWalls':
          await senders.postToGroup(sender.token, +address, message, attachment, cancelToken, captchaOpt)
          break
        case 'comments':
          await senders.sendToComments(sender.token, address, message, attachment, cancelToken, captchaOpt)
          break
        case 'discussions':
          await senders.sendToDiscussions(sender.token, address, message, attachment, cancelToken, captchaOpt)
          break
      }
    } catch (err) {
      // Отмена запроса
      if (axios.isCancel(err)) {
        dispatch(changeLogItem(key, {
          title: 'Запрос отменён',
          status: 'warning'
        }))
        // Ошибки вк
      } else if (err instanceof ApiError) {
        // Обработка капчи
        if (err.response.data.error.error_code === 14) {
          await dispatch(handleCaptcha(spamValues, err, key))
          // Другие ошибки
        } else {
          dispatch(changeLogItem(key, {
            title: `Ошибка вк - ${err.response.data.error.error_msg}`,
            status: 'error'
          }))
        }
      } else {
        dispatch(changeLogItem(key, {
          title: `Ошибка приложения - ${err}`,
          status: 'error'
        }))
      }
      return
    }

    // Если всё хорошо
    dispatch(changeLogItem(key, {
      title: `Отправлено - ${address} от ${senderName}`,
      status: 'success'
    }))
  }
}

export default handleSend
