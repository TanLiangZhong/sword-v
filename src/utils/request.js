import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.token = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const { code, msg } = res

    // 系统异常
    if (code === 'E0000') {
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(msg || 'Error'))
    }

    // 登录过期
    if (code === 'F0002') {
      MessageBox.confirm('您被登出系统，您可以取消停留在当前页或重新登录', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(msg || 'Error'))
    }

    // 无权访问
    if (code === 'F0003') {
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(msg || 'Error'))
    }
    return res
  },
  error => {
    Message({
      message: error.msg || '网络开小差，请稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
