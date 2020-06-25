import { addLogItem } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Валидирует поля форм и если ошибок заполнения нет возвращает true, иначе false
const validate = (
  spamValues: SpamValuesType,
  setFieldError: (field: string, message: string) => void
): ThunkType<boolean> => {
  return async (dispatch, getState) => {
    const accounts = getState().accountsReducer.accounts
    let isSuccess = true

    if (!accounts.length) {
      dispatch(addLogItem('Нету ни одного аккаунта', 'error', `Нету ни одного аккаунта - ${Date.now()}`))
      isSuccess = false
    } else if (!accounts.some(account => account.isEnabled)) {
      dispatch(addLogItem('Все аккаунты выключены', 'error', `Все аккаунты выключены - ${Date.now()}`))
      isSuccess = false
    }

    if (!spamValues.addresses.length) {
      setFieldError('addresses', 'Укажите адресаты спама')
      isSuccess = false
    }

    if (!spamValues.message && !spamValues.attachment) {
      setFieldError('message', 'Сообщение обязательно если не указаны вложения')
      setFieldError('attachment', 'Вложения обязательны если не указано сообщение')
      isSuccess = false
    }

    if (spamValues.captchaMode === 'Антикапча' && !spamValues.antiCaptchaKey) {
      setFieldError('antiCaptchaKey', 'Укажите ключ антикапчи')
      isSuccess = false
    }

    return isSuccess
  }
}

export default validate
