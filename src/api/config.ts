export const versionAPI = '5.110'
export const proxyURL = 'https://dry-lowlands-96591.herokuapp.com/'

export const getBaseURL = (method: string, token: string, opt?: { captchaKey?: string, captchaSid?: string }) => {
  let baseURL = `${proxyURL}https://api.vk.com/method/${method}?`
  baseURL += `v=${versionAPI}&`
  baseURL += `access_token=${token}&`

  if (opt) {
    baseURL += `captcha_key=${opt.captchaKey}&`
    baseURL += `captcha_sid=${opt.captchaSid}&`
  }

  return baseURL
}
