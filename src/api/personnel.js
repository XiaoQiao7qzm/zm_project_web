import request from '../axios'

const perlist = (url, options) => {
  return request.get(url, options)
}

const addPersonnel = (url, options) => {
  return request.post(url, options)
}

const deletePersonnel = (url, options) => {
  return request.delete(url, options)
}

const deleteBatchPersonnel = (url, options) => {
  return request.delete(url, options)
}

const upfilePersonnel = (url, options) => {
  return request.file(url, options)
}

const updatePersonnel = (url, options) => {
  return request.put(url, options)
}
export {
  perlist,
  addPersonnel,
  deletePersonnel,
  deleteBatchPersonnel,
  upfilePersonnel,
  updatePersonnel
}