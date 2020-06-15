export interface IAuthRes {
  access_token: string
  expires_in: number
  user_id: number
  trusted_hash: string

  error: string
  error_description: string
  validation_type: string
  validation_sid: string
  phone_mask: string
  redirect_uri: string
  captcha_img: string
  captcha_sid: number
}

export interface IGetProfileInfoRes {
  id: number
  first_name: string
  last_name: string
  is_closed: boolean
  can_access_closed: boolean
  photo_50: string
}

export interface ICreateTaskRes {
  errorId: number
  errorCode: string
  errorDescription: string
  taskId: number
}

export interface IGetTaskResultRes {
  errorId: number
  errorCode: string
  errorDescription: string
  status: string
  solution: any
  cost: number
  ip: string
  createTime: number
  endTime: number
  solveCount: number
}
