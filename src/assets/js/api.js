import http from './http.js'
const baseUrl = '/api'
// 登录
const login = (params) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// 修改账户密码
const changeUserPasd = (params) => http.post(`${baseUrl}/user/edit/pass`, params, 'application/json')
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
  delete: (params) => http.post(`${baseUrl}/store/log/delete`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/store/log/detail`, params)
}
// 物料采购单
const yarnOrder = {
  create: (params) => http.post(`${baseUrl}/material/order/save`, params, 'application/json'),
  detail: (params) => http.get(`${baseUrl}/material/order/detail`, params),
  list: (params) => http.get(`${baseUrl}/material/order/list`, params),
  delete: (params) => http.post(`${baseUrl}/material/order/delete`, params, 'application/json')
}
// 物料出入库
const yarnOutAndIn = {
  create: (params) => http.post(`${baseUrl}/material/stock/save`, params, 'application/json'),
  delete: (params) => http.post(`${baseUrl}/material/stock/log/delete`, params, 'application/json')
}
// 物料库存
const yarnStore = {
  nameList: (params) => http.get(`${baseUrl}/material/all`, params),
  list: (params) => http.get(`${baseUrl}/material/stock/list`, params),
  log: (params) => http.get(`${baseUrl}/material/stock/log`, params)
}
// 获取用户信息
const getAuthorization = {
  get: (params) => http.post(`${baseUrl}/auth/user`, params, 'application/json')
}
const userManage = {
  create: (params) => http.post(`${baseUrl}/user/save`, params, 'application/json')
}
export {
  changeUserPasd,
  userManage,
  getAuthorization,
  login,
  logout,
  getToken,
  product,
  store,
  outAndIn,
  yarnOrder,
  yarnOutAndIn,
  yarnStore
}
