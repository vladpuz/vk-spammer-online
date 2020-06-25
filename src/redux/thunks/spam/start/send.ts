import handleSend from './handleSend'
import stop from '../stop/stop'
import textRandomizer from '../../../../utils/textRandomizer/textRandomizer'
import { addLogItem, setAddresseeIndex, setSenderIndex } from '../../../ducks/spamer/action-creators'
import { ThunkType } from '../../../store'
import { SpamValuesType } from '../../../../types/types'

// Логика по запросам с разными аккаунтами
const send = (spamValues: SpamValuesType): ThunkType => {
  return async (dispatch, getState) => {
    const addresseeIndex = getState().spamerReducer.storedValues.addresseeIndex
    const accounts = getState().accountsReducer.accounts.filter(account => account.isEnabled)

    // Если время смены аккаунта равно нулю все аккаунты спамят одновременно
    if (!spamValues.autoSwitchTime) {
      for (let i = 0; i < accounts.length; i++) {
        dispatch(setSenderIndex(i))
        dispatch(handleSend({
          ...spamValues,
          message: textRandomizer(spamValues.message),
          attachment: textRandomizer(spamValues.attachment).split('\n').filter(str => str).join(',')
        }))
      }
      const nextAddresseeIndex = (addresseeIndex + 1 === spamValues.addresses.length) ? 0 : addresseeIndex + 1
      dispatch(setAddresseeIndex(nextAddresseeIndex))
      // Иначе спамят по очереди
    } else {
      const nextAddresseeIndex = (addresseeIndex + 1 === spamValues.addresses.length) ? 0 : addresseeIndex + 1
      dispatch(handleSend({
        ...spamValues,
        message: textRandomizer(spamValues.message),
        attachment: textRandomizer(spamValues.attachment).split('\n').filter(str => str).join(',')
      }))
      dispatch(setAddresseeIndex(nextAddresseeIndex))
    }

    // Если только один проход, то выключить спам после последнего аккаунта
    if (spamValues.onePass && (addresseeIndex + 1 === spamValues.addresses.length)) {
      await dispatch(stop(
        addLogItem('Проход окончен', 'info', `Проход окончен - ${Date.now()}`),
        spamValues.autoSwitchTime,
        false
      ))
    }
  }
}

export default send
