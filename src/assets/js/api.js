import http from './http.js'
const baseUrl = '/dress'
// 登录
const login = (params) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// 注销
const logout = (params) => http.post(`${baseUrl}/auth/logout`, params, 'application/json')
// token
const getToken = (params) => http.get(`${baseUrl}/upload/token`, params)
// 产品管理
const product = {
  create: (params) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/product/one`, params),
  delete: (params) => http.post(`${baseUrl}/product/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/list`, params)
}
// 产品类型
const productType = {
  create: (params) => http.post(`${baseUrl}/product/category/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/product/category/delete`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/product/category/list`, params)
}
// 仓库
const stock = {
  create: (params) => http.post(`${baseUrl}/factory/store/save`, params, 'application/json'),
  update: (params) => http.post(`${baseUrl}/factory/store/edit`, params, 'application/json'),
  list: (params) => http.get(`${baseUrl}/factory/store/list`, params),
  detail: (params) => http.get(`${baseUrl}/factory/store/one`, params)
}
export {
  login,
  logout,
  getToken,
  product,
  stock,
  productType
}
