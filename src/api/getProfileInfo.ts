import { IProfileInfo } from '../types/types'
import { version, proxyURL } from './config'
import axios from 'axios'

export async function getProfileInfo (token: string, userDomain: string | number): Promise<IProfileInfo> {
  let URL = `${proxyURL}https://api.vk.com/method/users.get?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `user_ids=${userDomain}&`
  URL += 'fields=photo_50&'

  const res = await axios.get(URL)
  const json = await res.data
  return json.response[0]
}
