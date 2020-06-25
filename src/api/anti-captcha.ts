import axios from 'axios'
import ApiError, { AntiCaptchaErrorRes } from './ApiError'

const antiCaptcha = axios.create({
  baseURL: 'https://api.anti-captcha.com/',
  validateStatus: () => true
})

export type CreateTaskRes = {
  taskId: number
}

// Создаем задачу на разгадывание капчи
export const createTask = async (clientKey: string, base64: string): Promise<CreateTaskRes> => {
  const response = await antiCaptcha.post('createTask', {
    clientKey,
    task: {
      type: 'ImageToTextTask',
      body: base64,
      minLength: 4,
      maxLength: 5
    }
  })

  if (response.data.errorId) throw new ApiError<AntiCaptchaErrorRes>(response)
  return response.data
}

export type GetTaskResultRes = {
  status: string
  solution: {
    text: string
    url: string
  }
  cost: number
  ip: string
  createTime: number
  endTime: number
  solveCount: number
}

// Пытаемся получить результат капчи
export const getTaskResult = async (clientKey: string, taskId: number): Promise<GetTaskResultRes> => {
  const response = await antiCaptcha.post('getTaskResult', { clientKey, taskId })
  if (response.data.errorId) throw new ApiError<AntiCaptchaErrorRes>(response)
  return response.data
}
