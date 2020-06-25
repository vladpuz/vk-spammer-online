import { AxiosResponse } from 'axios'

// Класс для создания ошибок api
class ApiError<T> extends Error {
  public response: AxiosResponse<T>

  constructor (response: AxiosResponse<T>) {
    super()
    this.name = 'ApiError'
    this.response = response
  }
}

export type VKErrorRes = {
  error: {
    error_code: number
    error_msg: string
    captcha_img: string
    captcha_sid: number
  }
}

export type AntiCaptchaErrorRes = {
  errorId: number
  errorCode: string
  errorDescription: string
}

export type AuthErrorRes = {
  error: string
  error_description: string
  validation_type: string
  validation_sid: string
  phone_mask: string
  redirect_uri: string
  captcha_img: string
  captcha_sid: number
}

export default ApiError
