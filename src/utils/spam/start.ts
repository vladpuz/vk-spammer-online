import store from '../../redux/store'
import {
  addLogItem,
  send,
  setAddresseeIndex,
  setAutoPauseTimerId,
  setAutoSwitchRemaining,
  setSenderIndex,
  setSenderTimerId,
  setSpamOnPause,
  setSpamOnRun,
  setSpamTimerId,
  setStartTimestamp
} from '../../redux/spamer-reducer'
import { setCurrentSender } from '../../redux/accounts-reducer'
import pause from './pause'
import stop from './stop'
import randomization from '../randomization'
import { ISpamValues } from '../../types/app-types'

function start (spamValues: ISpamValues, logItem: ReturnType<typeof addLogItem>) {
  const state = store.getState()
  const { autoSwitchRemaining, senderIndex } = state.spamerReducer.storedValues
  const accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)

  store.dispatch(setSpamOnRun(true))
  store.dispatch(setSpamOnPause(false))
  store.dispatch(logItem)

  // Установка таймера автопаузы
  if (spamValues.autoPauseTimeout) {
    const autoPauseTimerId = window.setTimeout(() => {
      pause(
        addLogItem('Сработала автопауза', 'info', `Сработала автопауза - ${Date.now()}`),
        spamValues.autoSwitchTime
      )
    }, spamValues.autoPauseTimeout * 60 * 1000)
    store.dispatch(setAutoPauseTimerId(autoPauseTimerId))
  }

  // Установка таймера смены отправителя с сохранением оставшегося времени
  if (autoSwitchRemaining && spamValues.autoSwitchTime) {
    store.dispatch(setStartTimestamp(Date.now()))

    const senderChangeTick = () => {
      const senderTimerId = window.setTimeout(senderChangeTick, spamValues.autoSwitchTime * 1000)
      store.dispatch(setSenderTimerId(senderTimerId))
      store.dispatch(setAutoSwitchRemaining(spamValues.autoSwitchTime))
      senderChange()
    }

    const senderTimerId = window.setTimeout(senderChangeTick, autoSwitchRemaining * 1000)

    store.dispatch(setSenderTimerId(senderTimerId))
    store.dispatch(setCurrentSender(accounts[senderIndex].profileInfo.id))
  }

  // Установка таймера рассылки
  const spamTick = () => {
    const spamTimerId = window.setTimeout(spamTick, spamValues.sendInterval * 1000)
    store.dispatch(setSpamTimerId(spamTimerId))
    spam(spamValues)
  }

  const spamTimerId = window.setTimeout(spamTick, spamValues.sendInterval * 1000)
  store.dispatch(setSpamTimerId(spamTimerId))
  spam(spamValues)
}

function senderChange () {
  const state = store.getState()
  const senderIndex = state.spamerReducer.storedValues.senderIndex
  const accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)

  const nextSenderIndex = (senderIndex + 1 === accounts.length) ? 0 : senderIndex + 1
  const currentAccount = accounts[nextSenderIndex]
  const accountName = `${currentAccount.profileInfo.first_name} ${currentAccount.profileInfo.last_name}`

  store.dispatch(setStartTimestamp(Date.now()))
  store.dispatch(setSenderIndex(nextSenderIndex))
  store.dispatch(setCurrentSender(accounts[nextSenderIndex].profileInfo.id))
  store.dispatch(addLogItem(
    `Смена аккаунта на ${accountName}`,
    'info',
    `Смена аккаунта на ${accountName} - ${Date.now()}`
  ))
}

function spam (spamValues: ISpamValues) {
  const state = store.getState()
  const addresseeIndex = state.spamerReducer.storedValues.addresseeIndex
  const accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)

  // Если время смены аккаунта равно нулю все аккаунты спамят одновременно
  if (!spamValues.autoSwitchTime) {
    for (let i = 0; i < accounts.length; i++) {
      store.dispatch(setSenderIndex(i))
      store.dispatch<any>(send({
        ...spamValues,
        message: randomization(spamValues.message),
        attachment: randomization(spamValues.attachment).split('\n').filter(str => str).join(',')
      }))
    }
    const nextAddresseeIndex = (addresseeIndex + 1 === spamValues.addresses.length) ? 0 : addresseeIndex + 1
    store.dispatch(setAddresseeIndex(nextAddresseeIndex))
  } else {
    const nextAddresseeIndex = (addresseeIndex + 1 === spamValues.addresses.length) ? 0 : addresseeIndex + 1
    store.dispatch<any>(send({
      ...spamValues,
      message: randomization(spamValues.message),
      attachment: randomization(spamValues.attachment).split('\n').filter(str => str).join(',')
    }))
    store.dispatch(setAddresseeIndex(nextAddresseeIndex))
  }

  // Если только один проход, то выключить спам после последнего аккаунта
  if (spamValues.onePass && (addresseeIndex + 1 === spamValues.addresses.length)) {
    stop(
      addLogItem('Проход окончен', 'info', `Проход окончен - ${Date.now()}`),
      spamValues.autoSwitchTime,
      false
    )
  }
}

export default start
