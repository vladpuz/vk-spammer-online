import { sendAPI, version } from './settings'
import { ISender } from '../types/types'

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
    const URL = `messages.removeChatUser?${this.initURL()}chat_id=${talkID}&user_id=${userID}&`
    return (await sendAPI.get(URL)).data
  }

  public async sendToPM (userDomain: string) {
    const URL = `messages.send?${this.initURL()}domain=${userDomain}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }

  public async sendToTalk (talkID: number) {
    const URL = `messages.send?${this.initURL()}peer_id=${2000000000 + talkID}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }

  public async sendToTalkAndLeave (talkID: number) {
    await this.sendToTalk(talkID)
    this.clearCaptcha()
    return this.leaveTheTalk(talkID, this.userID)
  }

  public async sendToComments (commentID: string) {
    const [ownerID, postID] = commentID.split('_')
    const URL = `wall.createComment?${this.initURL()}owner_id=${ownerID}&post_id=${postID}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }

  public async sendToDiscussions (discussionsID: string) {
    const [groupID, topicID] = discussionsID.split('_')
    const URL = `board.createComment?${this.initURL()}group_id=${groupID}&topic_id=${topicID}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }

  public async postToUser (userID: number) {
    const URL = `wall.post?${this.initURL()}owner_id=${userID}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }

  public async postToGroup (groupID: number) {
    const URL = `wall.post?${this.initURL()}owner_id=-${groupID}&`
    this.clearCaptcha()
    return (await sendAPI.get(URL)).data
  }
}

export default Sender
