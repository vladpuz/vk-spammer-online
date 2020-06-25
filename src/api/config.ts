import axios from 'axios'

export const apiVersion = '5.110'
export const proxyURL = 'https://dry-lowlands-96591.herokuapp.com/'
export const server = axios.create({ validateStatus: () => true })

export const getBaseURL = (
  token: string,
  method: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): string => {
  let baseURL = `${proxyURL}https://api.vk.com/method/${method}?`
  baseURL += `v=${apiVersion}&`
  baseURL += `access_token=${token}&`

  if (opt?.captchaKey && opt?.captchaSid) {
    baseURL += `captcha_key=${opt.captchaKey}&`
    baseURL += `captcha_sid=${opt.captchaSid}&`
  }

  return baseURL
}
