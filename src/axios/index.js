import axios from 'axios'
import config from '../assets/js/config'
import router from '../router'

const instance = axios.create({
  baseURL: config.req_url,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json',
  }
})
/**
 * 拦截响应response，并做一些错误处理
 */
instance.interceptors.response.use((response) => {
  // console.loresponse.datag('axios -- ', response)
  let res = response.data
  // 如果token过期 直接返回登陆
  if(res.code === 100) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    return {}
  }
  return res
}, (err) => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求参数错误'
        break
      case 401:
        err.message = '未授权，请登录'
        break
      case 403:
        err.message = '跨域拒绝访问'
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
        break
    }
  }
  return Promise.reject(err)
})

//请求发送拦截，把数据发送给后台之前做些什么......
instance.interceptors.request.use((request) => {
  request.headers['X-Access-Token'] = localStorage.getItem('token') || ''
  return request;
}, function (error) {
  return Promise.reject(error);
});

const request = (($i) => {
  return {
    get(url, params={}) {
      return $i.get(url, {
        params
      })
    },
    post(url, options={}) {
      return $i.post(url, options)
    },
    file(url, options={}) {
      let formData = new FormData()
      for(let key in options) {
        formData.append(key, options[key])
      }
      return $i.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    delete(url, data={}) {
      return $i.delete(url, { data })
    },
    put(url, options={}) {
      return $i.put(url, options)
    }
  }
})(instance)

export default request
