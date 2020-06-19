import store from '../../redux/store'
import {
  addLogItem,
  clearCancelers,
  setAddresseeIndex,
  setAutoSwitchRemaining,
  setSenderIndex,
  setSpamOnPause,
  setSpamOnRun
} from '../../redux/ducks/spamer/action-creators'
import { clearCurrentSender } from '../../redux/ducks/accounts/action-creators'

function stop (logItem: ReturnType<typeof addLogItem>, autoSwitchTime: number, isCancel: boolean = true) {
  const { timers, cancelers } = store.getState().spamerReducer

  store.dispatch(clearCancelers())
  store.dispatch(setSenderIndex(0))
  store.dispatch(setAddresseeIndex(0))
  store.dispatch(setAutoSwitchRemaining(autoSwitchTime))
  store.dispatch(setSpamOnRun(false))
  store.dispatch(setSpamOnPause(false))
  store.dispatch(clearCurrentSender())

  clearTimeout(timers.senderTimerId)
  clearTimeout(timers.spamTimerId)
  clearTimeout(timers.autoPauseTimerId)
  if (isCancel) cancelers.forEach(source => source.cancel())
  store.dispatch(logItem)
}

export default stop
