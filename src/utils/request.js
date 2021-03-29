import axios from 'axios'
import store from '@/store'
import router from '@/router'
import {
  Message
} from 'element-ui'

import {
  getTime
} from '@/utils/auth'

// 定义token超时时间
const timeOut = 3600
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础地址
  timeout: 5000 // 定义超时 5秒
}) // 创建一个axios实例
service.interceptors.request.use(config => {
  // 判断是否有token存在
  if (store.getters.token) {
    // 只有token存在的时候 才校验时间挫是否超时
    if (isCheckTimeOut()) {
      // 超时 ，删除token 退出登录
      store.dispatch('user/logout')
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了! '))
    }
    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回
}, error => {
  return Promise.reject(error)
}) // 创建一个请求拦截器 统一注入token
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const {
    success,
    message,
    data
  } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // token超时的被动处理
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 删除token 退出登录
    store.dispatch('user/logout')
    // 跳转到登录页面
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

// 判断是否超时
// （当前时间 - 缓存中的时间） 是否大于时间差
function isCheckTimeOut() {
  const currentTime = Date.now() // 当前时间
  const timeStamp = getTime() // 缓存时间
  return (currentTime - timeStamp) / 1000 > timeOut
}
export default service // 导出一个 axios实例
