import send from './send'
import { setSpamTimerId } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Устанавливаем таймеры отправки запросов
const setSendTimer = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch) => {
    const spamTick = () => {
      const spamTimerId = window.setTimeout(spamTick, spamValues.sendInterval * 1000)
      dispatch(setSpamTimerId(spamTimerId))
      dispatch(send(spamValues))
    }

    const spamTimerId = window.setTimeout(spamTick, spamValues.sendInterval * 1000)
    dispatch(setSpamTimerId(spamTimerId))
    dispatch(send(spamValues))
  }
}

export default setSendTimer
