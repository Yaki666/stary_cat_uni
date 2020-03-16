// 功能函数临时储存器
let doLastTimeout, doLastOperates = []
let timeout = 500

export default {
  /**
   * 队列执行的多个操作，只执行最后一个操作，比如输入内容检索
   * @param {function} operate 传入的操作
   * @param {number} idx (可选)执行特性索引号的操作，一般不会用到
   */
  doAsyncLast(operate, time = timeout, idx) {
    if (typeof operate !== 'function') {
      throw '执行doLast函数报错：需要传入函数！'
    }
    clearTimeout(doLastTimeout)
    doLastTimeout = setTimeout(() => {
      let lastOperate = doLastOperates[doLastOperates.length - 1]
      lastOperate()
      doLastOperates = []
      clearTimeout(doLastTimeout)
      doLastTimeout = null
    }, time)
    doLastOperates.push(operate)
  },
  /**
   * 某瞬间同时执行的多个操作，只执行最后一个操作，比如同时多个网络请求返回然后提示消息
   * @param {function} operate 传入的操作
   * @param {number} idx (可选)执行特性索引号的操作，一般不会用到
   */
  doSyncLast(operate, time = timeout, idx) {
    if (typeof operate !== 'function') {
      throw '执行doLast函数报错：需要传入函数！'
    }
    if (!doLastTimeout) {
      doLastTimeout = setTimeout(() => {
        let lastOperate = doLastOperates[doLastOperates.length - 1]
        lastOperate()
        doLastOperates = []
        clearTimeout(doLastTimeout)
        doLastTimeout = null
      }, time)
    }
    doLastOperates.push(operate)
  },
  /**
   * 数字整数部分保持一定长度，不足用0补充，比如时间
   * @params {number} num 传入的数字
   * @params {number} length 数字左侧留着的长度，默认2是作为常用倒计时
   */
  pointLeftNumberLength(num, length = 2) {
    if(typeof(num) === 'number') {
      let numStr = String(num)
      let leftLength = numStr.split('.')[0].length
      if(length > leftLength) {
        let lengthCut = length - leftLength
        let zeroStr = Array.from({length: lengthCut}, () => '0').join('')
        numStr = zeroStr + numStr
      }
      return numStr
    } else {
      throw '传数字类型!'
    }
  },
  /**
   * 使用dayjs格式化日期
   * @param {any} time 时间
   * @param {string} format 定制格式
   */
  formatDate(time, format) {
    return dayjs(time).format(format || 'YYYY-MM-DD')
  },
  /**
   * 对比今天是明天今天昨天前天等
   * @param {any} time 时间
   */
  formatDateDayByDay(time) {
    let cur = dayjs()
    let diff = dayjs(time).diff(cur, 'day')
    console.log(diff)
    if (Math.abs(diff) > 2) {
      return dayjs(time).format('YYYY-MM-DD')
    } else {
      let res
      switch (diff) {
        case 2:
          res = '后天'
          break
        case 1:
          res = '明天'
          break
        case 0:
          res = '今天'
          break
        case -1:
          res = '昨天'
          break
        case -2:
          res = '前天'
          break
      }
      return res
    }
  },
  /**
   * 正则替换字符为星号
   * @param start {number} 开始位置
   * @param length {number} 长度
   */
  replaceStar(str, start, length) {
    const regexp = new RegExp(`^(.{${start}}).{${length}}(.*)$`, 'g')
    return str.replace(regexp, `$1${Array.from({length}, () => '*').join('')}$2`)
  },
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  },
  /**
   * 获取当前页面
   */
  getCurrentPageUrl() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = `/${currentPage.route}`
    return url
  },
  /**
   * 获取当前页面路径与参数
   */
  getCurrentPageUrlWithArgs() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options
    let urlWithArgs = `/${url}?`
    for (let key in options) {
      const value = options[key]
      urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  },
  /**
   * 从链接获取参数
   * @param {string} path 解析的链接
   */
  getPathParams(path) {
    let search = path.split('?')[1]
    if (search) {
      let key_value_list = search.split('&')
      let obj = {}
      key_value_list.map(key_value => {
        let temp_arr = key_value.split('=')
        obj[temp_arr[0]] = temp_arr[1]
        return obj
      })
      return obj
    } else {
      return {}
    }
  },
}