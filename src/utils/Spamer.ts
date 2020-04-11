import { IAccount, ISender, spamModeType, IValues, ISpamData, logStatusType } from '../types/types'
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
  changeLogItem
} from '../redux/spamer-reducer'
import Sender from '../api/Sender'
import { clearCurrentSender, setCurrentSender } from '../redux/accounts-reducer'
import randomization from './randomization'

class Spamer {
  private values: IValues
  private initData: ISpamData
  private accounts: Array<IAccount>
  private sender: ISender
  readonly accountsSwitchTime: number

  constructor (values: IValues) {
    this.values = values
    this.initData = store.getState().spamerReducer.initData
    this.accounts = store.getState().accountsReducer.accounts.filter(account => account.isEnabled)
    this.accountsSwitchTime = store.getState().spamerReducer.settings.autoSwitchTime

    this.sender = new Sender(
      this.accounts[this.initData.senderIndex].token,
      this.accounts[this.initData.senderIndex].profileInfo.id,
      randomization(this.values.message),
      randomization(this.values.attachment).split('\n').filter(str => str).join(',')
    )
  }

  private async send (mode: spamModeType) {
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
    // Нужно для сохранения отправителя в лексическом окружении
    const senderIndex = this.initData.senderIndex
    const accountName = `${this.accounts[senderIndex].profileInfo.first_name} ${this.accounts[senderIndex].profileInfo.last_name}`
    const addressName = this.values.addressees[this.initData.addresseeIndex]

    const key = Date.now()
    store.dispatch(addLogItem(`Отправляется - ${addressName} от ${accountName}`, 'success', true, key))

    this.send(this.values.spamMode).then(res => {
      console.log(res)

      if (res.error) {
        store.dispatch(changeLogItem(key, {
          title: `Ошибка - ${res.error.error_msg}`,
          status: 'error',
          loading: false
        }))
        if (res.error.error_msg === 'Captcha needed') {

        }
      }

      else {
        store.dispatch(changeLogItem(key, {
          title: `Отправлено - ${addressName} от ${accountName}`,
          loading: false
        }))
      }
    })
  }

  private setAutoPauseTimeout () {
    return window.setTimeout(() => {
      Spamer.pause('Сработала автопауза', 'info')
    }, this.values.autoPauseTimeout * 60 * 1000)
  }

  private setSenderChangeInterval () {
    return window.setInterval(() => {
      const nextSenderIndex = (this.initData.senderIndex + 1 === this.accounts.length) ? 0 : this.initData.senderIndex + 1

      this.initData.senderIndex = nextSenderIndex
      this.sender.token = this.accounts[this.initData.senderIndex].token
      this.sender.userID = this.accounts[this.initData.senderIndex].profileInfo.id

      store.dispatch(setSenderIndex(nextSenderIndex))
      store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    }, this.accountsSwitchTime * 1000)
  }

  private spam (first: boolean) {
    let nextAddresseeIndex = this.initData.addresseeIndex

    // Если время смены аккаунта равно нулю все аккаунты спамят одновременно
    if (!this.accountsSwitchTime) {
      if (!first) {
        nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
        this.initData.addresseeIndex = nextAddresseeIndex
        store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      }
      for (let i = 0; i < this.accounts.length; i++) {
        this.sender.token = this.accounts[i].token
        this.sender.userID = this.accounts[i].profileInfo.id
        this.sender.message = randomization(this.values.message)
        this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
        this.initData.senderIndex = i
        this.handleSend()
      }
    }

    else {
      if (!first) {
        nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
        this.initData.addresseeIndex = nextAddresseeIndex
        this.sender.message = randomization(this.values.message)
        this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
        store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      }
      this.handleSend()
    }

    // Если только один проход, то выключить спам когда придет время
    if (this.values.onePass && (nextAddresseeIndex + 1 === this.values.addressees.length)) {
      Spamer.stop('Проход окончен', 'info')
    }
  }

  public start () {
    if (this.values.autoPauseTimeout) {
      const autoPauseTimerID = this.setAutoPauseTimeout()
      store.dispatch(setAutoPauseTimerID(autoPauseTimerID))
    }

    if (this.accountsSwitchTime) {
      const senderTimerID = this.setSenderChangeInterval()
      store.dispatch(setSenderTimerID(senderTimerID))
      store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    }

    const spamTimerID = window.setInterval(this.spam.bind(this, false), this.values.sendInterval * 1000)
    store.dispatch(setSpamTimerID(spamTimerID))
    this.spam(true)
  }

  private static clearIntervals () {
    clearInterval(store.getState().spamerReducer.timers.senderTimerID)
    clearInterval(store.getState().spamerReducer.timers.spamTimerID)
    clearInterval(store.getState().spamerReducer.timers.autoPauseTimerID)
  }

  public static stop (logTitle: string, logState: logStatusType) {
    store.dispatch(setSenderIndex(0))
    store.dispatch(setAddresseeIndex(0))
    store.dispatch(setSpamOnRun(false))
    store.dispatch(setSpamOnPause(false))
    store.dispatch(clearCurrentSender())
    store.dispatch(addLogItem(logTitle, logState, false, Date.now()))
    Spamer.clearIntervals()
  }

  public static pause (logTitle: string, logState: logStatusType) {
    store.dispatch(setSpamOnPause(true))
    store.dispatch(addLogItem(logTitle, logState, false, Date.now()))
    Spamer.clearIntervals()
  }
}

export default Spamer
