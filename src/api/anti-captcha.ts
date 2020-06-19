import axios from 'axios'

const antiCaptcha = axios.create({
  baseURL: 'https://api.anti-captcha.com/'
})

type CreateTaskRes = {
  errorId: number
  errorCode: string
  errorDescription: string
  taskId: number
}

// Создаем задачу на разгадывание капчи
export async function createTask (clientKey: string, base64: string): Promise<CreateTaskRes> {
  const res = await antiCaptcha.post('createTask', {
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

type GetTaskResultRes = {
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

// Пытаемся получить результат капчи
export async function getTaskResult (clientKey: string, taskId: number): Promise<GetTaskResultRes> {
  const res = await antiCaptcha.post('getTaskResult', { clientKey, taskId })
  return res.data
}
