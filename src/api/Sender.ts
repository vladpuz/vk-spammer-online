import { baseURL, version } from './settings'
import { ISender } from '../types/types'
import { addCancelerItem } from '../redux/spamer-reducer'
import store from '../redux/store'

class Sender implements ISender {
  public token: string
  public userID: number
  public message: string
  public attachment: string
  public captchaKey: string
  public captchaSid: number

  constructor (token: string, userID: number) {
    this.token = token
    this.userID = userID
    this.message = ''
    this.attachment = ''
    this.captchaKey = ''
    this.captchaSid = 0
  }

  private initURL () {
    let URL = `v=${version}&`
    URL += `access_token=${this.token}&`
    URL += `message=${this.message}&`
    URL += (this.attachment ? `attachment=${this.attachment}&` : '&')

    if (this.captchaKey && this.captchaSid) {
      URL += `captcha_key=${this.captchaKey}&`
      URL += `captcha_sid=${this.captchaSid}&`
    }

    return URL
  }

  private clearCaptcha () {
    this.captchaKey = ''
    this.captchaSid = 0
  }

  private async leaveTheTalk (talkID: number, userID: number) {
    const URL = `${baseURL}messages.removeChatUser?${this.initURL()}chat_id=${talkID}&user_id=${userID}&`
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async sendToPM (userDomain: string) {
    const URL = `${baseURL}messages.send?${this.initURL()}domain=${userDomain}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async sendToTalk (talkID: number) {
    const URL = `${baseURL}messages.send?${this.initURL()}peer_id=${2000000000 + talkID}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async sendToTalkAndLeave (talkID: number) {
    await this.sendToTalk(talkID)
    return await this.leaveTheTalk(talkID, this.userID)
  }

  public async sendToComments (commentID: string) {
    const [ownerID, postID] = commentID.split('_')
    const URL = `${baseURL}wall.createComment?${this.initURL()}owner_id=${ownerID}&post_id=${postID}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async sendToDiscussions (discussionsID: string) {
    const [groupID, topicID] = discussionsID.split('_')
    const URL = `${baseURL}board.createComment?${this.initURL()}group_id=${groupID}&topic_id=${topicID}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async postToUser (userID: number) {
    const URL = `${baseURL}wall.post?${this.initURL()}owner_id=${userID}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }

  public async postToGroup (groupID: number) {
    const URL = `${baseURL}wall.post?${this.initURL()}owner_id=-${groupID}&`
    this.clearCaptcha()
    const abortController = new AbortController()
    store.dispatch(addCancelerItem(abortController.abort))

    const res = await fetch(URL, { signal: abortController.signal })
    return await res.json()
  }
}

export default Sender
