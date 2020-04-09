import { IAccount, ISender, spamModeType } from '../types/types'
import store from '../redux/store'
import {
  setSenderTimerID,
  setCurrentSenderIndex,
  setSpamTimerID,
  setCurrentAddresseeIndex,
  addLogItem,
  setSpamOnpause,
  setSpamIsRun, addSendOperation
} from '../redux/spamer-reducer'
import Sender from '../api/Sender'
import { clearCurrentSender, setCurrentSender } from '../redux/accounts-reducer'
import randomization from './randomization'

interface IValue {
  message: string
  attachment: string
  sendInterval: number
  autoPauseTimeout: number
  onePass: boolean
  antiCaptcha: boolean
  spamMode: spamModeType
  addressees: Array<string>
}

interface IInitValue {
  currentAddresseeIndex: number
  currentSenderIndex: number
  autoPauseTimeout: number
}

class Spamer {
  readonly values: IValue
  private accounts: Array<IAccount>
  private sender: ISender
  private initValues: {
    currentAddresseeIndex: number
    currentSenderIndex: number
    autoPauseTimeout: number
  }

  constructor (values: IValue, initValues: IInitValue) {
    this.values = values
    this.accounts = store.getState().accountsReducer.accounts.filter(account => account.isEnabled)
    this.initValues = {
      currentAddresseeIndex: initValues.currentAddresseeIndex || 0,
      currentSenderIndex: initValues.currentSenderIndex || 0,
      autoPauseTimeout: initValues.autoPauseTimeout
    }

    this.sender = new Sender(
      this.accounts[this.initValues.currentSenderIndex].token,
      this.accounts[this.initValues.currentSenderIndex].profileInfo.id,
      randomization(this.values.message),
      randomization(this.values.attachment).split('\n').filter(str => str).join(',')
    )
  }

  private async send (mode: spamModeType) {
    const address = this.values.addressees[this.initValues.currentAddresseeIndex]

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

  public start () {
    const prevSenderIndex = this.initValues.currentSenderIndex
    const prevAddressIndex = this.initValues.currentAddresseeIndex
    const autoSwitchTime = store.getState().spamerReducer.settings.autoSwitchTime * 1000

    // Автопауза
    if (+this.values.autoPauseTimeout) {
      window.setTimeout(() => {
        Spamer.pause()
      }, this.values.autoPauseTimeout * 60 * 1000)
    }

    // Интервал для смены отправителей
    if (autoSwitchTime) {
      const accounts = store.getState().accountsReducer.accounts
      const senderTimerID = window.setInterval(() => {
        const nextSenderIndex = (prevSenderIndex + 1 === this.accounts.length) ? 0 : prevSenderIndex + 1
        store.dispatch(setCurrentSenderIndex(nextSenderIndex))

        this.initValues.currentSenderIndex = nextSenderIndex
        this.sender.token = accounts[prevSenderIndex].token
        this.sender.myID = accounts[prevSenderIndex].profileInfo.id

        store.dispatch(setCurrentSender(accounts[prevSenderIndex].profileInfo.id))
      }, autoSwitchTime)
      store.dispatch(setCurrentSender(accounts[prevSenderIndex].profileInfo.id))

      store.dispatch(setSenderTimerID(senderTimerID))
    }

    // Функция для отправки
    const send = () => {
      const doSend = () => {
        const promise = this.send(this.values.spamMode).then(res => {
          console.log(res)
          if (res.error) {
            store.dispatch(addLogItem(`${res.error.error_msg}`, 'error'))
          }

          else {
            const addressName = this.values.addressees[prevAddressIndex]
            const accountFirstName = this.accounts[this.initValues.currentSenderIndex].profileInfo.first_name
            const accountLastName = this.accounts[this.initValues.currentSenderIndex].profileInfo.last_name
            const accountName = `${accountFirstName} ${accountLastName}`
            store.dispatch(addLogItem(`Отправлено - ${addressName} от ${accountName}`, 'success'))
          }
        })

        this.sender.message = randomization(this.values.message)
        this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
        return promise
      }

      if (autoSwitchTime) {
        store.dispatch(addSendOperation(doSend()))
      }

      else {
        for (let i = 0; i < this.accounts.length; i++) {
          this.sender.token = this.accounts[i].token
          this.sender.myID = this.accounts[i].profileInfo.id
          store.dispatch(addSendOperation(doSend()))
        }
      }
    }

    // Интервал для смены адресатов
    const spamTimerID = window.setInterval(() => {
      let nextIndex = 0
      if (!this.values.onePass) {
        nextIndex = (prevAddressIndex + 1 === this.accounts.length) ? 0 : prevAddressIndex + 1
      }

      else {
        if (prevAddressIndex + 1 === this.accounts.length) {
          Spamer.stop()
          store.dispatch(addLogItem('Проход окончен', 'info'))
          store.dispatch(clearCurrentSender())
          store.dispatch(setSpamOnpause(false))
          store.dispatch(setSpamIsRun(false))
        }

        else {
          nextIndex = prevAddressIndex + 1
        }
      }
      store.dispatch(setCurrentAddresseeIndex(nextIndex))
      send()
    }, this.values.sendInterval * 1000)
    if (!this.values.onePass) send()

    store.dispatch(setSpamTimerID(spamTimerID))
  }

  static stop () {
    clearInterval(store.getState().spamerReducer.senderTimerID)
    clearInterval(store.getState().spamerReducer.spamTimerID)
    store.dispatch(setCurrentSenderIndex(0))
    store.dispatch(setCurrentAddresseeIndex(0))
  }

  static pause () {
    store.dispatch(setSpamOnpause(true))
    store.dispatch(addLogItem('Сработала автопауза', 'info'))
    clearInterval(store.getState().spamerReducer.senderTimerID)
    clearInterval(store.getState().spamerReducer.spamTimerID)
  }

}

export default Spamer
