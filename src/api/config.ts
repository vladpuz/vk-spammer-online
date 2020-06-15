export const versionAPI = '5.110'
export const proxyURL = 'https://dry-lowlands-96591.herokuapp.com/'
export const antiCaptchaBaseURL = 'https://api.anti-captcha.com/'

export const getBaseURL = (
  method: string,
  token: string,
  opt?: { captchaKey?: string, captchaSid?: number }
): string => {
  let baseURL = `${proxyURL}https://api.vk.com/method/${method}?`
  baseURL += `v=${versionAPI}&`
  baseURL += `access_token=${token}&`

  if (opt?.captchaKey && opt?.captchaSid) {
    baseURL += `captcha_key=${opt.captchaKey}&`
    baseURL += `captcha_sid=${opt.captchaSid}&`
  }

  return baseURL
}

export const authApps = {
  android: {
    clientId: '2274003',
    clientSecret: 'hHbZxrka2uZ6jB1inYsH'
  },
  iphone: {
    clientId: '3140623',
    clientSecret: 'VeWdmVclDCtn6ihuP1nt'
  },
  ipad: {
    clientId: '3682744',
    clientSecret: 'mY6CDUswIVdJLCD3j15n'
  },
  windows: {
    clientId: '3697615',
    clientSecret: 'AlVXZFMUqyrnABp8ncuU'
  },
  windowsPhone: {
    clientId: '3502557',
    clientSecret: 'PEObAuQi6KloPM4T30DV'
  }
}
