import { IProfileInfo } from '../types/types'
import { version, proxyURL } from './settings'

export async function getProfileInfo (token: string, userDomain: string | number): Promise<IProfileInfo> {
  let URL = `${proxyURL}https://api.vk.com/method/users.get?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `user_ids=${userDomain}&`
  URL += `fields=photo_50&`

  const res = await fetch(URL)
  const json = await res.json()
  return json.response[0]
}
