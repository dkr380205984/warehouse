const getHash = (hashStr) => {
  const json = {}
  const params = hashStr.split('&&')
  params.forEach((item) => {
    json[item.split('=')[0]] = item.split('=')[1]
  })
  return json
}
const downloadExcel = (data, titles, orderInfo, excelName) => {
  let orderElement = ''
  if (orderInfo) {
    const orderInfoType = Object.prototype.toString.call(orderInfo).split(' ')[1].split(']')[0]
    orderInfo = orderInfoType === 'Object' ? [orderInfo] : orderInfo
    orderElement = orderInfo.map(itemOrder => {
      return `<table>
                <tr>
                  <td style="text-align:left">订单号：</td>
                  <td style="text-align:left">${itemOrder.order_code}</td>
                </tr>
                <tr>
                  <td style="text-align:left">订单公司：</td>
                  <td style="text-align:left">${itemOrder.client_name}</td>
                </tr>
                <tr>
                  <td style="text-align:left">负责小组：</td>
                  <td style="text-align:left">${itemOrder.group_name}</td>
                </tr>
                <tr>
                  <td style="text-align:left">下单日期：</td>
                  <td style="text-align:left">${itemOrder.order_time}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </table>`
    }).join('')
  }
  const aLink = document.createElement('a')
  const excelHeader = '<tr>' + titles.map(item => '<td style="text-align:left">' + item.title + '</td>').join('') + '</tr>'
  const excelContent = data.map(itemData => {
    return '<tr>' + titles.map(itemTitle => '<td style="text-align:left">' + ((itemData[itemTitle.key] !== 0 && !itemData[itemTitle.key]) ? '' : itemData[itemTitle.key]) + '</td>').join('') + '</tr>'
  })
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
                    xmlns:x="urn:schemas-microsoft-com:office:excel" 
                    xmlns="http://www.w3.org/TR/REC-html40">
              <meta http-equiv="content-type" content="application/vnd.ms-excel; charset="UTF-8">
              <head>
                <!--[if gte mso 9]>
                <xml>
                <x:ExcelWorkbook>
                  <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                      <x:Name>${excelName || 'worksheet1'}</x:Name>
                      <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                      </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                  </x:ExcelWorksheets>
                </x:ExcelWorkbook>
                </xml>
                <![endif]-->
              </head>
              <body>
                ${orderElement}
                <table>${excelHeader}${excelContent.join('')}</table>
              </body>
            </html>`
  const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html)
  aLink.href = url
  aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
  aLink.click()
}
const getDataType = (data) => {
  if (data === null) {
    return 'Null'
  } else if (data === undefined) {
    return 'Undefined'
  }
  return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
}
const cloneData = (data) => {
  const type = getDataType(data)
  let newData = null
  if (type === 'Array') {
    newData = []
    data.forEach((item, index) => {
      newData[index] = cloneData(item)
    })
  } else if (type === 'Object') {
    newData = {}
    for (const index in data) {
      const item = data[index]
      newData[index] = cloneData(item)
    }
  } else {
    newData = data ? JSON.parse(JSON.stringify(data)) : data
  }
  return newData
}
const flatten = (data) => {
  const oldData = cloneData(data)
  const type = getDataType(oldData)
  if (type === 'Object') {
    for (const index in oldData) {
      const item = oldData[index]
      const itemType = getDataType(item)
      if (itemType === 'Object') {
        const deleteProp = cloneData(item) // 保存一份需要处理的数据
        delete oldData[index]
        for (const hasKey in oldData) {
          if (deleteProp[hasKey]) {
            throw new TypeError('存在相同的key值，无法执行')
          }
        }
        return flatten({ ...oldData, ...deleteProp })
      } else if (itemType === 'Array') {
        const newData = []
        const deleteProp = cloneData(item) // 保存一份需要处理的数据
        delete oldData[index]
        if (deleteProp.length < 1) {
          newData.push({ ...oldData })
        } else {
          deleteProp.forEach(itemDel => {
            newData.push({ ...oldData, [index]: itemDel })
          })
        }
        return flatten(newData)
      }
    }
    return oldData
  } else if (type === 'Array') {
    for (const index in oldData) {
      const item = oldData[index]
      const itemType = getDataType(item)
      if (itemType === 'Object') {
        oldData[index] = flatten(item)
      } else if (itemType === 'Array') {
        const newArr = []
        oldData.forEach(itemOld => {
          newArr.push(...itemOld)
        })
        return flatten(newArr)
      }
    }
    return oldData
  } else {
    return oldData
  }
}
const formCheck = (data, type, msg) => {
  if (type === 'ifNull') {
    if (!data) {
      return msg || '数据不得为空'
    }
  } else if (type === 'ifNumber') {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (data === '' || data == null) {
      return msg || '数据不得为空'
    }
    if (isNaN(data)) {
      return msg || '请填写数字'
    }
  }
  return false
}
export {
  getHash,
  downloadExcel,
  flatten,
  formCheck
}
