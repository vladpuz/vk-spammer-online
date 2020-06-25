import {
  addLogItem,
  setAutoSwitchRemaining,
  setSenderIndex,
  setSenderTimerId,
  setStartTimestamp
} from '../../../ducks/spamer/action-creators'
import { setCurrentSender } from '../../../ducks/accounts/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Устанавливаем таймеры смены отправителей
const setSenderChangeTimer = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch, getState) => {
    const senderChange = () => {
      const senderIndex = getState().spamerReducer.storedValues.senderIndex
      const accounts = getState().accountsReducer.accounts.filter(account => account.isEnabled)
      const nextSenderIndex = (senderIndex + 1 === accounts.length) ? 0 : senderIndex + 1
      const currentAccount = accounts[nextSenderIndex]
      const accountName = `${currentAccount.profile.first_name} ${currentAccount.profile.last_name}`

      dispatch(setStartTimestamp(Date.now()))
      dispatch(setSenderIndex(nextSenderIndex))
      dispatch(setCurrentSender(accounts[nextSenderIndex].profile.id))
      dispatch(addLogItem(
        `Смена аккаунта на ${accountName}`,
        'info',
        `Смена аккаунта на ${accountName} - ${Date.now()}`
      ))
    }

    const { autoSwitchRemaining, senderIndex } = getState().spamerReducer.storedValues
    const accounts = getState().accountsReducer.accounts.filter(account => account.isEnabled)

    if (autoSwitchRemaining && spamValues.autoSwitchTime) {
      dispatch(setStartTimestamp(Date.now()))

      const senderChangeTick = () => {
        const senderTimerId = window.setTimeout(senderChangeTick, spamValues.autoSwitchTime * 1000)
        dispatch(setSenderTimerId(senderTimerId))
        dispatch(setAutoSwitchRemaining(spamValues.autoSwitchTime))
        senderChange()
      }

      const senderTimerId = window.setTimeout(senderChangeTick, autoSwitchRemaining * 1000)
      dispatch(setSenderTimerId(senderTimerId))
      dispatch(setCurrentSender(accounts[senderIndex].profile.id))
    }
  }
}

export default setSenderChangeTimer
