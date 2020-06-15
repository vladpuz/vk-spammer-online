import axios from 'axios'
import { antiCaptchaBaseURL } from './config'
import { ICreateTaskRes, IGetTaskResultRes } from '../types/api-types'

export async function createTask (clientKey: string, base64: string): Promise<ICreateTaskRes> {
  const res = await axios.post(`${antiCaptchaBaseURL}createTask`, {
    clientKey,
    task: {
      type: 'ImageToTextTask',
      body: base64,
      minLength: 4,
      maxLength: 5
    }
  })

  return res.data
}

export async function getTaskResult (clientKey: string, taskId: number): Promise<IGetTaskResultRes> {
  const res = await axios.post(`${antiCaptchaBaseURL}getTaskResult`, { clientKey, taskId })
  return res.data
}
