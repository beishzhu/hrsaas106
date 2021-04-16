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
        // 如果没有id 才表示当前用户资料没有获取过
        // async 函数所 return的内容 用await 就可以接收到
        const {
          roles
        } = await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为要获取完资料才放行 即异步改成同步
        // 筛选用户的可用路由
        // actions 中函数 默认是 Promise对象 调用这个对象 想要获取返回的值话 必须加await 或 Then
        // actions 是做异步操作的
        const routers = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes 就是筛选得到的动态路由
        // 动态路由添加到路由表中 默认的路由表只有静态路由 没有动态路由
        // addRoutes 必须 用next(地址) 不能用next()
        router.addRoutes([
          ...routers,
          {
            path: '*',
            redirect: '/404',
            hidden: true
          },
        ]) // 添加动态路由到路由表 铺路
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next() // 不是登录页 放行通过
      }
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
