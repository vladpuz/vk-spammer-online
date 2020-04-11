import { addLogItem, setSpamOnRun } from '../redux/spamer-reducer'
import Spamer from './Spamer'
import { IValues } from '../types/types'
import store from '../redux/store'

// Проверяет данные и начинает спам
function submit (values: IValues, setErrors: any, setFieldError: any, addLog: () => void) {
  const accounts = store.getState().accountsReducer.accounts

  // Валидация
  if (!accounts.length) store.dispatch(addLogItem('Нету ни одного аккаунта', 'warning', false, Date.now()))
  else if (!accounts.some(account => account.isEnabled)) {
    store.dispatch(addLogItem('Все аккаунты выключены', 'warning', false, Date.now()))
  }
  if (!values.message && !values.attachment) {
    setErrors({
      message: 'Сообщение обязательно если не указаны вложения',
      attachment: 'Вложения обязательны если не указано сообщение'
    })
  }
  if (!values.addressees.length) setFieldError('addressees', 'Укажите адресаты спама')

  // Если всё ок
  if (
    (values.message || values.attachment) &&
    values.addressees.length &&
    accounts.length &&
    accounts.some(account => account.isEnabled)
  ) {
    store.dispatch(setSpamOnRun(true))
    addLog()

    new Spamer({
      ...values,
      attachment: values.attachment,
      addressees: values.addressees,
      message: values.message.split('\n').join('%0A')
    }).start()
  }

}

export default submit
