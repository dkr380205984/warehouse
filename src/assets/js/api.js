import http from './http.js'
const baseUrl = '/store'
// 登录
const login = (params) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// 注销
const logout = (params) => http.post(`${baseUrl}/auth/logout`, params, 'application/json')
// token
const getToken = (params) => http.get(`${baseUrl}/upload/token`, params)
// 产品管理
const product = {
  create: (params) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/one`, params),
  delete: (params) => http.post(`${baseUrl}/product/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/list`, params),
  deleteSize: (params) => http.post(`${baseUrl}/product/size/delete`, params, 'application/json')
}
// 仓库
const store = {
  create: (params) => http.post(`${baseUrl}/store/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/store/list`, params)
}
// 出入库
const outAndIn = {
  create: (params) => http.post(`${baseUrl}/store/total/save`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/store/log/list`, params),
  delete: (params) => http.post(`${baseUrl}/store/log/delete`, params, 'application/json')
}
export {
  login,
  logout,
  getToken,
  product,
  store,
  outAndIn
}
