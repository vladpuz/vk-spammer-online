import axios from 'axios'
import { IProfileInfo } from '../types/types'
import { version, proxyURL } from './settings'

export async function getProfileInfo (token: string, userDomain: string | number) {
  let URL = `${proxyURL}https://api.vk.com/method/users.get?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `user_ids=${userDomain}&`
  URL += `fields=photo_50&`

  return (await axios.get(URL)).data.response[0] as IProfileInfo
}
