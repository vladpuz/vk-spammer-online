import { IProfileInfo } from '../types/types'
import { vkAPI, version } from './settings'

export async function getProfileInfo (token: string, userDomain: string | number): Promise<IProfileInfo> {
  let URL = `users.get?`
  URL += `v=${version}&`
  URL += `access_token=${token}&`
  URL += `user_ids=${userDomain}&`
  URL += `fields=photo_50&`

  return (await vkAPI.get(URL)).data.response[0]
}
