import axios from 'axios'

export const version = '5.89'
export const proxyURL = 'https://cors-anywhere.herokuapp.com/'
export const server = axios.create({
  baseURL: `${proxyURL}https://api.vk.com/method/`
})
