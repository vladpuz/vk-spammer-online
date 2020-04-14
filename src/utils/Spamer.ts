import { IAccount, ISender, IValues, IInitData, LogStatusType } from '../types/types'
import store from '../redux/store'
import {
  setSenderTimerID,
  setSenderIndex,
  setSpamTimerID,
  setAddresseeIndex,
  addLogItem,
  setSpamOnPause,
  setSpamOnRun,
  setAutoPauseTimerID,
  changeLogItem,
  setStartTimestamp,
  setAutoSwitchRemaining,
} from '../redux/spamer-reducer'
import Sender from '../api/Sender'
import { clearCurrentSender, setCurrentSender } from '../redux/accounts-reducer'
import randomization from './randomization'

class Spamer {
  private values: IValues
  private initData: IInitData
  private accounts: Array<IAccount>
  private sender: ISender
  readonly accountsSwitchTime: number

  constructor (values: IValues) {
    const state = store.getState()

    this.values = values
    this.initData = state.spamerReducer.initData
    this.accounts = state.accountsReducer.accounts.filter(account => account.isEnabled)
    this.accountsSwitchTime = state.spamerReducer.settings.autoSwitchTime

    this.sender = new Sender(
      this.accounts[this.initData.senderIndex].token,
      this.accounts[this.initData.senderIndex].profileInfo.id,
      randomization(this.values.message),
      randomization(this.values.attachment).split('\n').filter(str => str).join(','),
    )
  }

  private async send () {
    const mode = this.values.spamMode
    const address = this.values.addressees[this.initData.addresseeIndex]

    switch (mode) {
      case 'pm':
        return await this.sender.sendToPM(address)
      case 'talks':
        return await this.sender.sendToTalk(+address)
      case 'talksAutoExit':
        return await this.sender.sendToTalkAndLeave(+address)
      case 'usersWalls':
        return await this.sender.postToUser(+address)
      case 'groupsWalls':
        return await this.sender.postToGroup(+address)
      case 'comments':
        return await this.sender.sendToComments(address)
      case 'discussions':
        return await this.sender.sendToDiscussions(address)
    }
  }

  private handleSend () {
    // senderIndex, accountName, addressName должны сохранится в лексическом окружении
    const senderIndex = this.initData.senderIndex
    const accountName = `${this.accounts[senderIndex].profileInfo.first_name} ${this.accounts[senderIndex].profileInfo.last_name}`
    const addressName = this.values.addressees[this.initData.addresseeIndex]

    console.group('handleSend')
    console.log('senderIndex: ' + senderIndex)
    console.log('senderID: ' + this.sender.userID)
    console.log('accountName: ' + accountName)
    console.log('addressName: ' + addressName)
    console.groupEnd()

    const key = `${Date.now()} Запрос обрабатывается pending ${senderIndex} ${accountName} ${addressName}`
    store.dispatch(addLogItem('Запрос обрабатывается', 'pending', key))

    this.send().then(res => {
      console.log(res)

      if (res.error) {
        store.dispatch(changeLogItem(key, {
          title: `Ошибка - ${res.error.error_msg}`,
          status: 'error',
        }))
        if (res.error.error_msg === 'Captcha needed') {}
      } else {
        store.dispatch(changeLogItem(key, {
          title: `Отправлено - ${addressName} от ${accountName}`,
          status: 'success',
        }))
      }
    })
  }

  private setAutoPauseTimeout () {
    return window.setTimeout(() => {
      Spamer.pause('Сработала автопауза', 'info')
    }, this.values.autoPauseTimeout * 60 * 1000)
  }

  private senderChange () {
    const senderIndex = (this.initData.senderIndex + 1 === this.accounts.length) ? 0 : this.initData.senderIndex + 1

    this.initData.senderIndex = senderIndex
    this.sender.token = this.accounts[senderIndex].token
    this.sender.userID = this.accounts[senderIndex].profileInfo.id
    const accountName = `${this.accounts[senderIndex].profileInfo.first_name} ${this.accounts[senderIndex].profileInfo.last_name}`

    store.dispatch(setStartTimestamp(Date.now()))
    store.dispatch(setSenderIndex(senderIndex))
    store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    store.dispatch(addLogItem(
      `Смена аккаунта на ${accountName}`,
      'info',
      `${Date.now()} Смена аккаунта на ${accountName} info`,
    ))
  }

  private randomize () {
    this.sender.message = randomization(this.values.message)
    this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
  }

  private spam () {
    let nextAddresseeIndex = this.initData.addresseeIndex

    // Если время смены аккаунта равно нулю все аккаунты спамят одновременно
    if (!this.accountsSwitchTime) {
      nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
      store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      for (let i = 0; i < this.accounts.length; i++) {
        this.sender.token = this.accounts[i].token
        this.sender.userID = this.accounts[i].profileInfo.id
        this.initData.senderIndex = i
        this.randomize()
        this.handleSend()
      }
      this.initData.addresseeIndex = nextAddresseeIndex
    } else {
      nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
      store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      this.randomize()
      this.handleSend()
      this.initData.addresseeIndex = nextAddresseeIndex
    }

    // Если только один проход, то выключить спам когда придет время
    if (this.values.onePass && (nextAddresseeIndex === 0)) {
      Spamer.stop('Проход окончен', 'info')
    }
  }

  public start () {
    if (this.values.autoPauseTimeout) {
      const autoPauseTimerID = this.setAutoPauseTimeout()
      store.dispatch(setAutoPauseTimerID(autoPauseTimerID))
    }

    // Смена отправителя с сохранением оставшегося времени
    store.dispatch(setStartTimestamp(Date.now()))
    if (this.initData.autoSwitchRemaining && this.accountsSwitchTime) {
      const senderTimerID = window.setTimeout(() => {
        this.senderChange()
        store.dispatch(setAutoSwitchRemaining(this.accountsSwitchTime))

        if (this.accountsSwitchTime) {
          const senderTimerID = window.setInterval(this.senderChange.bind(this), this.accountsSwitchTime * 1000)
          store.dispatch(setSenderTimerID(senderTimerID))
          store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
        }
      }, this.initData.autoSwitchRemaining * 1000)

      store.dispatch(setSenderTimerID(senderTimerID))
      store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    }

    const spamTimerID = window.setInterval(this.spam.bind(this), this.values.sendInterval * 1000)
    store.dispatch(setSpamTimerID(spamTimerID))
    this.spam()
  }

  private static clearIntervals () {
    clearInterval(store.getState().spamerReducer.timers.senderTimerID)
    clearTimeout(store.getState().spamerReducer.timers.senderTimerID)
    clearInterval(store.getState().spamerReducer.timers.spamTimerID)
    clearTimeout(store.getState().spamerReducer.timers.autoPauseTimerID)
  }

  public static stop (logTitle: string, logStatus: LogStatusType) {
    store.dispatch(setSenderIndex(0))
    store.dispatch(setAddresseeIndex(0))
    store.dispatch(setAutoSwitchRemaining(store.getState().spamerReducer.settings.autoSwitchTime))
    store.dispatch(setSpamOnRun(false))
    store.dispatch(setSpamOnPause(false))
    store.dispatch(clearCurrentSender())
    store.dispatch(addLogItem(
      logTitle,
      logStatus,
      `${Date.now()} ${logTitle} ${logStatus}`,
    ))

    Spamer.clearIntervals()
  }

  public static pause (logTitle: string, logStatus: LogStatusType) {
    const startTimestamp = store.getState().spamerReducer.startTimestamp
    const autoSwitchRemaining = store.getState().spamerReducer.initData.autoSwitchRemaining
    const autoSwitchTime = store.getState().spamerReducer.settings.autoSwitchTime

    if (autoSwitchRemaining && autoSwitchTime) {
      console.log(
        `${autoSwitchTime} - (${(Date.now() - startTimestamp) / 1000} + ${autoSwitchTime - autoSwitchRemaining})`,
      )

      store.dispatch(setAutoSwitchRemaining(
        autoSwitchTime - ((Date.now() - startTimestamp) / 1000 + (autoSwitchTime - autoSwitchRemaining)),
      ))
    }

    store.dispatch(setSpamOnPause(true))
    store.dispatch(addLogItem(
      logTitle,
      logStatus,
      `${Date.now()} ${logTitle} ${logStatus}`,
    ))

    Spamer.clearIntervals()
  }
}

export default Spamer
