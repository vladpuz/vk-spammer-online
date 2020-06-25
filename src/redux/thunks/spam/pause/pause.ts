import { addLogItem, setAutoSwitchRemaining, setSpamOnPause } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'

// Пауза очищает таймеры, но не обнуляет storedValues в state и устанавливаем autoSwitchRemaining
const pause = (logItem: ReturnType<typeof addLogItem>, autoSwitchTime: number): ThunkType => {
  return async (dispatch, getState) => {
    const { storedValues, startTimestamp, timers } = getState().spamerReducer

    // Устанавливаем оставшееся время перед отправкой чтобы спамер не зависал на одном аккаунте с капчей
    if (storedValues.autoSwitchRemaining && autoSwitchTime) {
      dispatch(setAutoSwitchRemaining(
        autoSwitchTime - ((Date.now() - startTimestamp) / 1000 + (autoSwitchTime - storedValues.autoSwitchRemaining))
      ))
    }

    clearTimeout(timers.senderTimerId)
    clearTimeout(timers.spamTimerId)
    clearTimeout(timers.autoPauseTimerId)
    dispatch(setSpamOnPause(true))
    dispatch(logItem)
  }
}

export default pause
