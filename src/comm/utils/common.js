function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
export function getGuid () {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export function initguid () {
  return getGuid()
}

export function isValidIP (ip) {
  var reg = /^http:\/\/.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).+.$/
  return reg.test(ip)
}

// 格式化日期，如月、日、时、分、秒保证为2位数
function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 参数number为毫秒时间戳，format为需要转换成的日期格式
export function formatTime (number, format) {
  let time = new Date(number)
  let newArr = []
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  newArr.push(time.getFullYear())
  newArr.push(formatNumber(time.getMonth() + 1))
  newArr.push(formatNumber(time.getDate()))

  newArr.push(formatNumber(time.getHours()))
  newArr.push(formatNumber(time.getMinutes()))
  newArr.push(formatNumber(time.getSeconds()))

  for (let i in newArr) {
    format = format.replace(formatArr[i], newArr[i])
  }
  return format
}

export function dataSizeFun (limit) {
  var size = ''
  if (limit < 0.1 * 1024) {
    size = limit.toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + 'MB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    size = (limit / (1024 * 1024)).toFixed(2) + 'GB'
  } else {
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'TB'
  }
  var sizestr = size + ''
  var len = sizestr.indexOf('\.')
  var dec = sizestr.substr(len + 1, 2)
  if (dec === '00') {
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
  }
  return sizestr
}

export function defaultDate (flag, beginEndTime, date) {
  let orderDate = null
  if (date !== null) {
    if (flag === 'default' && beginEndTime === 'start' && date === '') {
      orderDate = new Date(new Date(new Date().setTime(new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 3600 * 1000 * 24 * 30)).setHours(0, 0, 0, 0))
    } else if (flag === 'default' && beginEndTime === 'end' && date === '') {
      orderDate = new Date(new Date(new Date().setTime(new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 60000)).setHours(23, 59, 59, 59))
    } else if (flag === 'notDefault' && beginEndTime === 'start' && date !== '') {
      orderDate = new Date(new Date(new Date().setTime(new Date(new Date(date).setHours(0, 0, 0, 0)).getTime())).setHours(0, 0, 0, 0))
    } else if (flag === 'notDefault' && beginEndTime === 'end' && date !== '') {
      orderDate = new Date(new Date(new Date().setTime(new Date(new Date(date).setHours(0, 0, 0, 0)).getTime())).setHours(23, 59, 59, 59))
    }
  } else {
    if (beginEndTime === 'start') {
      orderDate = new Date(1970, 0, 1, 8)
    } else {
      orderDate = new Date(new Date(new Date().setTime(new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 6000000000000)).setHours(23, 59, 59, 59))
    }
  }
  return orderDate
}

