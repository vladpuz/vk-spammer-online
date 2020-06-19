import store from '../../redux/store'
import { addLogItem } from '../../redux/ducks/spamer/action-creators'
import start from './start'
import { SpamValuesType } from '../../types/types'

// Валидирует данные и начинает спам
function validate (
  spamValues: SpamValuesType,
  setFieldError: (field: string, message: string) => void,
  logItem: ReturnType<typeof addLogItem>
) {
  const accounts = store.getState().accountsReducer.accounts

  // Валидация
  if (!accounts.length) {
    store.dispatch(addLogItem('Нету ни одного аккаунта', 'error', `Нету ни одного аккаунта - ${Date.now()}`))
  } else if (!accounts.some(account => account.isEnabled)) {
    store.dispatch(addLogItem('Все аккаунты выключены', 'error', `Все аккаунты выключены - ${Date.now()}`))
  }

  if (!spamValues.addresses.length) setFieldError('addresses', 'Укажите адресаты спама')
  if (!spamValues.message && !spamValues.attachment) {
    setFieldError('message', 'Сообщение обязательно если не указаны вложения')
    setFieldError('attachment', 'Вложения обязательны если не указано сообщение')
  }
  if (spamValues.captchaMode === 'Антикапча' && !spamValues.antiCaptchaKey) {
    setFieldError('antiCaptchaKey', 'Укажите ключ антикапчи')
  }

  // Если всё ок
  if (
    (spamValues.message || spamValues.attachment) &&
    spamValues.addresses.length &&
    accounts.length &&
    accounts.some(account => account.isEnabled) &&
    !(spamValues.captchaMode === 'Антикапча' && !spamValues.antiCaptchaKey)
  ) {
    start(
      {
        ...spamValues,
        message: spamValues.message.split('\n').join('%0A')
      },
      logItem
    )
  }
}

export default validate
