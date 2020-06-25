import validate from './validate'
import setAutoPauseTimer from './setAutoPauseTimer'
import setSenderChangeTimer from './setSenderChangeTimer'
import setSendTimer from './setSendTimer'
import { addLogItem, setSpamOnPause, setSpamOnRun } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

/*
Порядок работы функции start:
1. validate
2. setAutoPauseTimer
3. setSenderChangeTimer
4. setSendTimer ->
  5. send ->
    6. handleSend ->
      7. handleCaptcha
*/

const start = (
  logItem: ReturnType<typeof addLogItem>,
  spamValues: SpamValuesType,
  setFieldError?: (field: string, message: string) => void
): ThunkType => {
  return async (dispatch) => {
    // Валидация
    if (setFieldError) {
      const isSuccessValidate = await dispatch(validate(spamValues, setFieldError))
      if (!isSuccessValidate) return
    }

    // Инициализация
    dispatch(setSpamOnRun(true))
    dispatch(setSpamOnPause(false))
    dispatch(logItem)

    // Установка таймера автопаузы
    await dispatch(setAutoPauseTimer(spamValues))

    // Установка таймера смены отправителя
    await dispatch(setSenderChangeTimer(spamValues))

    // Установка таймера рассылки
    await dispatch(setSendTimer(spamValues))
  }
}

export default start
