import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// 定义白名单
const whiteList = ['/login', '/404']
// 路由导航前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // 判断是否有token
  if (store.getters.token) {
    // 有token 判断是否是登录页
    if (to.path === '/login') {
      next('/') // 有token 访问的是登录页 要放行跳转到主页
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗？
      // 如果当前vuex 有用户资料的id 表示已经有资料了 不需要获取了 如果没有id 才需要获取
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo') // 为什么要写await 因为要获取完资料才放行 即异步改成同步
      }
      next() // 不是登录页 放行通过
    }
  } else {
    // 没有 token 判断是否在白名单内
    if (whiteList.indexOf(to.path) > -1) {
      next() // 在名单内 直接放行
    } else {
      next('/login') // 不在名单内 跳转到登录页
    }
  }
  NProgress.done()
})

// 路由导航后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
