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
  addSendOperation
} from '../redux/spamer-reducer'
import Sender from '../api/Sender'
import { clearCurrentSender, setCurrentSender } from '../redux/accounts-reducer'
import randomization from './randomization'

class Spamer {
  private values: IValues
  private spamData: ISpamData
  private accounts: Array<IAccount>
  readonly accountsSwitchTime: number
  private sender: ISender

  constructor (values: IValues) {
    this.values = values
    this.spamData = store.getState().spamerReducer.initData
    this.accounts = store.getState().accountsReducer.accounts.filter(account => account.isEnabled)
    this.accountsSwitchTime = store.getState().spamerReducer.settings.autoSwitchTime

    this.sender = new Sender(
      this.accounts[this.spamData.senderIndex].token,
      this.accounts[this.spamData.senderIndex].profileInfo.id,
      randomization(this.values.message),
      randomization(this.values.attachment).split('\n').filter(str => str).join(',')
    )
  }

  private async send (mode: spamModeType) {
    const address = this.values.addressees[this.spamData.addresseeIndex]

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
    const runSend = () => {
      const promise = this.send(this.values.spamMode).then(res => {
        console.log(res)
        if (res.error) {
          store.dispatch(addLogItem(`${res.error.error_msg}`, 'error'))
          if (res.error.error_msg === 'Captcha needed') {

          }
        }

        else {
          const addressName = this.values.addressees[this.spamData.addresseeIndex]
          const accountFirstName = this.accounts[this.spamData.senderIndex].profileInfo.first_name
          const accountLastName = this.accounts[this.spamData.senderIndex].profileInfo.last_name
          const accountName = `${accountFirstName} ${accountLastName}`
          store.dispatch(addLogItem(`Отправлено - ${addressName} от ${accountName}`, 'success'))
        }
      })

      this.sender.message = randomization(this.values.message)
      this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
      return promise
    }

    if (this.accountsSwitchTime) {
      store.dispatch(addSendOperation(runSend()))
    }

    else {
      for (let i = 0; i < this.accounts.length; i++) {
        this.sender.token = this.accounts[i].token
        this.sender.userID = this.accounts[i].profileInfo.id
        store.dispatch(addSendOperation(runSend()))
      }
    }
  }

  private setAutoPauseTimeout () {
    return window.setTimeout(() => {
      Spamer.pause('Сработала автопауза', 'info')
    }, this.values.autoPauseTimeout * 60 * 1000)
  }

  private setSpamInterval () {
    return window.setInterval(() => {
      let nextIndex = 0
      if (this.values.onePass) {
        if (this.spamData.addresseeIndex === this.values.addressees.length - 1) {
          Spamer.stop()
          store.dispatch(addLogItem('Проход окончен', 'info'))
          store.dispatch(clearCurrentSender())
          store.dispatch(setSpamOnPause(false))
          store.dispatch(setSpamOnRun(false))
        }

        else {
          nextIndex = this.spamData.addresseeIndex + 1
        }
      }

      else {
        nextIndex = (this.spamData.addresseeIndex + 1 === this.values.addressees.length) ? 0 : this.spamData.addresseeIndex + 1
      }
      store.dispatch(setAddresseeIndex(nextIndex))
      this.spamData.addresseeIndex = nextIndex
      this.handleSend()
    }, this.values.sendInterval * 1000)
  }

  private setSenderChangeInterval () {
    return window.setInterval(() => {
      const nextSenderIndex = (this.spamData.senderIndex + 1 === this.accounts.length) ? 0 : this.spamData.senderIndex + 1
      store.dispatch(setSenderIndex(nextSenderIndex))

      this.spamData.senderIndex = nextSenderIndex
      this.sender.token = this.accounts[this.spamData.senderIndex].token
      this.sender.userID = this.accounts[this.spamData.senderIndex].profileInfo.id

      store.dispatch(setCurrentSender(this.accounts[this.spamData.senderIndex].profileInfo.id))
    }, this.accountsSwitchTime * 1000)
  }

  public start () {
    if (this.values.autoPauseTimeout) this.setAutoPauseTimeout()

    if (this.accountsSwitchTime) {
      const senderTimerID = this.setSenderChangeInterval()
      store.dispatch(setSenderTimerID(senderTimerID))
      store.dispatch(setCurrentSender(this.accounts[this.spamData.senderIndex].profileInfo.id))
    }

    const spamTimerID = this.setSpamInterval()
    store.dispatch(setSpamTimerID(spamTimerID))
    this.handleSend()
  }

  public static stop () {
    clearInterval(store.getState().spamerReducer.timers.senderTimerID)
    clearInterval(store.getState().spamerReducer.timers.spamTimerID)
    store.dispatch(setSenderIndex(0))
    store.dispatch(setAddresseeIndex(0))
  }

  public static pause (logTitle: string, logState: logStatusType) {
    store.dispatch(setSpamOnPause(true))
    store.dispatch(addLogItem(logTitle, logState))
    clearInterval(store.getState().spamerReducer.timers.senderTimerID)
    clearInterval(store.getState().spamerReducer.timers.spamTimerID)
  }
}

export default Spamer
