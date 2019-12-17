import request from '../axios'

const register = (url, options) => {
  return request.post(url, options)
}

const login = (url, options) => {
  return request.post(url, options)
}

const getUserInfo = (url, options) => {
  return request.get(url, options)
}

const uploadHead = (url, options) => {
  return request.file(url, options)
}
const exit = (url, options) => {
  return request.post(url, options)
}

export {
  register,
  login,
  getUserInfo,
  uploadHead,
  exit
}