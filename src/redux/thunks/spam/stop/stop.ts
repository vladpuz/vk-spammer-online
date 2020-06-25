import {
  addLogItem,
  clearCancelers,
  setAddresseeIndex,
  setAutoSwitchRemaining,
  setSenderIndex,
  setSpamOnPause,
  setSpamOnRun
} from '../../../ducks/spamer/action-creators'
import { clearCurrentSender } from '../../../ducks/accounts/action-creators'
import { ThunkType } from '../../../store'

// Стоп очищает таймеры и сбрасывает все storedValues в state
const stop = (
  logItem: ReturnType<typeof addLogItem>,
  autoSwitchTime: number,
  cancel: boolean = true
): ThunkType => {
  return async (dispatch, getState) => {
    const { timers, cancelers } = getState().spamerReducer

    if (cancel) cancelers.forEach(source => source.cancel())

    clearTimeout(timers.senderTimerId)
    clearTimeout(timers.spamTimerId)
    clearTimeout(timers.autoPauseTimerId)

    dispatch(clearCancelers())
    dispatch(setSenderIndex(0))
    dispatch(setAddresseeIndex(0))
    dispatch(setAutoSwitchRemaining(autoSwitchTime))
    dispatch(setSpamOnRun(false))
    dispatch(setSpamOnPause(false))
    dispatch(clearCurrentSender())
    dispatch(logItem)
  }
}

export default stop
