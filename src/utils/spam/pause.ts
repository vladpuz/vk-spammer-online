import store from '../../redux/store'
import { addLogItem, setAutoSwitchRemaining, setSpamOnPause } from '../../redux/ducks/spamer/action-creators'

function pause (logItem: ReturnType<typeof addLogItem>, autoSwitchTime: number) {
  const { storedValues, startTimestamp, timers } = store.getState().spamerReducer

  if (storedValues.autoSwitchRemaining && autoSwitchTime) {
    store.dispatch(setAutoSwitchRemaining(
      autoSwitchTime - ((Date.now() - startTimestamp) / 1000 + (autoSwitchTime - storedValues.autoSwitchRemaining))
    ))
  }

  store.dispatch(setSpamOnPause(true))

  clearTimeout(timers.senderTimerId)
  clearTimeout(timers.spamTimerId)
  clearTimeout(timers.autoPauseTimerId)
  store.dispatch(logItem)
}

export default pause
