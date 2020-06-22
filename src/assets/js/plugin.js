
/************************************
 *data:需要处理的时间戳数据
 *type:type=>Date
 *return:yyyy-MM-dd
 ***********************************/
const getTime = (date) => {
  if (date && !new Date(date)) {
    throw new TypeError('The correct format was not obtained for function "getTime"')
  }
  const nowDate = date ? new Date(date) : new Date()
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth() + 1
  const data = nowDate.getDate()
  return [year, month.toString()[1] ? month : '0' + month, data.toString()[1] ? data : '0' + data].join('-')
}

export default {
  install (Vue) {
    Vue.prototype.$getTime = getTime
  }
}
