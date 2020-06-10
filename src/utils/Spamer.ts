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
  addCaptchaItem,
  removeCaptchaItem,
  clearCancelers
} from '../redux/spamer-reducer'
import Sender from '../api/Sender'
import { clearCurrentSender, setCurrentSender, setIsEnabled } from '../redux/accounts-reducer'
import randomization from './randomization'
import storage from 'store2'

class Spamer {
  private values: IValues
  private initData: IInitData
  private accounts: Array<IAccount>
  private sender: ISender

  constructor (values: IValues) {
    this.values = values
    this.initData = store.getState().spamerReducer.initData
    this.accounts = store.getState().accountsReducer.accounts.filter(account => account.isEnabled)

    this.sender = new Sender(
      this.accounts[this.initData.senderIndex].token,
      this.accounts[this.initData.senderIndex].profileInfo.id
    )
  }

  private checkCaptcha (userID: number) {
    const captcha = store.getState().spamerReducer.captcha
    const captchaIndex = captcha.findIndex(item => item.userID === userID && item.captchaKey)

    if (~captchaIndex) {
      this.sender.captchaKey = captcha[captchaIndex].captchaKey
      this.sender.captchaSid = captcha[captchaIndex].captchaSid
      store.dispatch(removeCaptchaItem(userID))
    }
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
    // senderIndex, accountName, addressName, accountID должны сохранится в лексическом окружении
    const senderIndex = this.initData.senderIndex
    const accountName = `${this.accounts[senderIndex].profileInfo.first_name} ${this.accounts[senderIndex].profileInfo.last_name}`
    const addressName = this.values.addressees[this.initData.addresseeIndex]
    const accountID = this.accounts[senderIndex].profileInfo.id
    this.checkCaptcha(accountID)

    const key = `${Date.now()} Запрос обрабатывается pending ${senderIndex} ${accountName} ${addressName} ${accountID}`
    store.dispatch(addLogItem('Запрос обрабатывается', 'pending', key))

    this.send().then(res => {
      console.log(res)

      if (!res.error) {
        store.dispatch(changeLogItem(key, {
          title: `Отправлено - ${addressName} от ${accountName}`,
          status: 'success'
        }))
        return
      }

      if (res.error.error_msg === 'Captcha needed') {
        switch (this.values.captchaMode) {
          case 'Антикапча':
            const state = store.getState()
            state.spamerReducer.cancelers.forEach((controller) => {controller.abort()})
            store.dispatch(clearCancelers())
            store.dispatch(changeLogItem(key, {
              title: `Потребовалась капча для аккаунта ${accountName}`,
              status: 'warning'
            }))
            if (!state.spamerReducer.spamOnPause) {
              Spamer.pause('Антикапча пока не сделана, но скоро будет)', 'error')
            }
            // запрос на anti-captcha.com
            // установка кода капчи
            // продолжение спама
            break

          case 'Показывать капчу':
            store.getState().spamerReducer.cancelers.forEach((controller) => {controller.abort()})
            store.dispatch(clearCancelers())

            store.dispatch(changeLogItem(key, {
              title: `Потребовалась капча для аккаунта ${accountName}`,
              status: 'warning'
            }))

            store.dispatch(addCaptchaItem(res.error.captcha_img, +res.error.captcha_sid, accountID))
            if (!store.getState().spamerReducer.spamOnPause) {
              Spamer.pause('Требуется капча, спам приостановлен', 'info')
            }
            break

          case 'Игнорировать капчу':
            const nextSenderIndex = (senderIndex + 1 === this.accounts.length) ? 0 : senderIndex + 1

            if (this.accounts[senderIndex].isEnabled) {
              store.dispatch(changeLogItem(key, {
                title: `Потребовалась капча, аккаунт ${accountName} был выключен`,
                status: 'warning'
              }))
              store.getState().spamerReducer.cancelers.forEach((controller) => {controller.abort()})
              store.dispatch(clearCancelers())
            }

            const accounts = storage.local.get('accounts').map((account: IAccount) => {
              return account.profileInfo.id === accountID ? {
                ...account,
                isEnabled: false
              } : account
            })
            storage.local.set('accounts', accounts)

            this.accounts[senderIndex].isEnabled = false
            this.initData.senderIndex = nextSenderIndex
            store.dispatch(setIsEnabled(accountID, false))
            store.dispatch(setCurrentSender(this.accounts[nextSenderIndex].profileInfo.id))

            if (this.accounts.every(account => !account.isEnabled) && store.getState().spamerReducer.spamOnRun) {
              Spamer.stop('Все аккаунты были выключены, спам остановлен', 'info')
            }
            break
        }
      } else {
        store.dispatch(changeLogItem(key, {
          title: `Ошибка - ${res.error.error_msg}`,
          status: 'error'
        }))
      }
    }).catch(err => {
      if (err.name === 'AbortError') {
        store.dispatch(changeLogItem(key, {
          title: 'Запрос отменён',
          status: 'warning'
        }))
      } else if (err.name === 'SyntaxError') {
        store.dispatch(changeLogItem(key, {
          title: 'Превышена длина запроса',
          status: 'error'
        }))
      } else {
        store.dispatch(changeLogItem(key, {
          title: `Ошибка - ${err}`,
          status: 'error'
        }))
        throw err
      }
    })
  }

  private senderChange () {
    const nextSenderIndex = (this.initData.senderIndex + 1 === this.accounts.length) ? 0 : this.initData.senderIndex + 1
    const accountName = `${this.accounts[nextSenderIndex].profileInfo.first_name} ${this.accounts[nextSenderIndex].profileInfo.last_name}`

    this.initData.senderIndex = nextSenderIndex
    this.sender.token = this.accounts[nextSenderIndex].token
    this.sender.userID = this.accounts[nextSenderIndex].profileInfo.id

    store.dispatch(setStartTimestamp(Date.now()))
    store.dispatch(setSenderIndex(nextSenderIndex))
    store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    store.dispatch(addLogItem(
      `Смена аккаунта на ${accountName}`,
      'info',
      `${Date.now()} Смена аккаунта на ${accountName} info`
    ))
  }

  private spam () {
    let nextAddresseeIndex = this.initData.addresseeIndex

    // Если время смены аккаунта равно нулю все аккаунты спамят одновременно
    if (!store.getState().spamerReducer.settings.autoSwitchTime) {
      nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
      store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      for (let i = 0; i < this.accounts.length; i++) {
        this.sender.token = this.accounts[i].token
        this.sender.userID = this.accounts[i].profileInfo.id
        this.initData.senderIndex = i
        this.sender.message = randomization(this.values.message)
        this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
        this.handleSend()
      }
      this.initData.addresseeIndex = nextAddresseeIndex
    } else {
      nextAddresseeIndex = (nextAddresseeIndex + 1 === this.values.addressees.length) ? 0 : nextAddresseeIndex + 1
      store.dispatch(setAddresseeIndex(nextAddresseeIndex))
      this.sender.message = randomization(this.values.message)
      this.sender.attachment = randomization(this.values.attachment).split('\n').filter(str => str).join(',')
      this.handleSend()
      this.initData.addresseeIndex = nextAddresseeIndex
    }

    // Если только один проход, то выключить спам после последнего аккаунта
    if (this.values.onePass && (nextAddresseeIndex === 0)) {
      Spamer.stop('Проход окончен', 'info')
    }
  }

  public start () {
    // Установка таймера автопаузы
    if (this.values.autoPauseTimeout) {
      const autoPauseTimerID = window.setTimeout(() => {
        Spamer.pause('Сработала автопауза', 'info')
      }, this.values.autoPauseTimeout * 60 * 1000)
      store.dispatch(setAutoPauseTimerID(autoPauseTimerID))
    }

    // Установка таймера смены отправителя с сохранением оставшегося времени
    const autoSwitchTime = store.getState().spamerReducer.settings.autoSwitchTime
    if (this.initData.autoSwitchRemaining && autoSwitchTime) {
      store.dispatch(setStartTimestamp(Date.now()))

      const senderChangeTick = () => {
        this.senderChange()
        const senderTimerID = window.setTimeout(senderChangeTick, autoSwitchTime * 1000)
        store.dispatch(setSenderTimerID(senderTimerID))
        store.dispatch(setAutoSwitchRemaining(autoSwitchTime))
      }

      const senderTimerID = window.setTimeout(senderChangeTick, this.initData.autoSwitchRemaining * 1000)

      store.dispatch(setSenderTimerID(senderTimerID))
      store.dispatch(setCurrentSender(this.accounts[this.initData.senderIndex].profileInfo.id))
    }

    // Установка таймера рассылки
    const spamTick = () => {
      this.spam()
      const spamTimerID = window.setTimeout(spamTick, this.values.sendInterval * 1000)
      store.dispatch(setSpamTimerID(spamTimerID))
    }

    const spamTimerID = window.setTimeout(spamTick, this.values.sendInterval * 1000)
    store.dispatch(setSpamTimerID(spamTimerID))
    this.spam()
  }

  private static clearTimers () {
    const state = store.getState()
    clearTimeout(state.spamerReducer.timers.senderTimerID)
    clearTimeout(state.spamerReducer.timers.spamTimerID)
    clearTimeout(state.spamerReducer.timers.autoPauseTimerID)
  }

  public static pause (logTitle: string, logStatus: LogStatusType) {
    const state = store.getState()
    const startTimestamp = state.spamerReducer.startTimestamp
    const autoSwitchRemaining = state.spamerReducer.initData.autoSwitchRemaining
    const autoSwitchTime = state.spamerReducer.settings.autoSwitchTime

    if (autoSwitchRemaining && autoSwitchTime) {
      store.dispatch(setAutoSwitchRemaining(
        autoSwitchTime - ((Date.now() - startTimestamp) / 1000 + (autoSwitchTime - autoSwitchRemaining))
      ))
    }

    store.dispatch(setSpamOnPause(true))
    store.dispatch(addLogItem(logTitle, logStatus, `${Date.now()} ${logTitle} ${logStatus}`))
    Spamer.clearTimers()
  }

  public static stop (logTitle: string, logStatus: LogStatusType) {
    store.getState().spamerReducer.cancelers.forEach((controller) => { controller.abort() })
    store.dispatch(clearCancelers())
    store.dispatch(setSenderIndex(0))
    store.dispatch(setAddresseeIndex(0))
    store.dispatch(setAutoSwitchRemaining(store.getState().spamerReducer.settings.autoSwitchTime))
    store.dispatch(setSpamOnRun(false))
    store.dispatch(setSpamOnPause(false))
    store.dispatch(clearCurrentSender())
    store.dispatch(addLogItem(logTitle, logStatus, `${Date.now()} ${logTitle} ${logStatus}`))
    Spamer.clearTimers()
  }
}

export default Spamer
