import {
  constantRoutes,
  asyncRoutes
} from '@/router' //导入静态路由

// vuex中 permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes //所有人默认拥有静态路由
}
const mutations = {
  // newRoutes 可以认为是 用户登录 通过权限所的得到的动态路由部分
  setRoutes(state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...constantRoutes, ...state.routes]
    // 有一种情况 张三 登录获取了动态路由 追加到路由上 李四登录 4个动态路由
    // 应该是 每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus:['settings','permissions']
  // asyncRoutes 是所有的动态路由
  // asyncroutes[{path:'settings',name:'settiong'},{}]
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      // key 就是标识
      // asyncRoutes 找有没有对象中的name属性等于key的 如果找不到就没有权限 如果找到要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组元素 也有可能是空数组
    });
    // 得到的routes 是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return state数据 是用来 显示在左侧菜单用的 return是给路由addRoutes的
  }
}

export default ({
  namespaced: true,
  state,
  mutations,
  actions
})
