import axios from 'axios'

const cancelToken = axios.CancelToken
const source = cancelToken.source()
export const cancel = source.cancel

export const version = '5.89'
export const proxyURL = 'https://cors-anywhere.herokuapp.com/'
export const sendAPI = axios.create({
  baseURL: `${proxyURL}https://api.vk.com/method/`,
  cancelToken: source.token,
})
