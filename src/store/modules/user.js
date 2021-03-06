import {
  getToken,
  setToken,
  removeToken,
  setTime
} from '@/utils/auth'

import {
  login,
  getUserInfo,
  getUserdetailById
} from '@/api/user'

import {
  resetRouter
} from '@/router/index'

// 状态
const state = {
  token: getToken(), // 设置token初始状态 token持久化放到缓存中
  userInfo: {} // 设置一个空对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
    // state.userInfo = {...result} // 浅拷贝的方式
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result) // 提交mutations 设置token
    setTime() // 在缓冲中设置时间挫
  },
  // 获取用户资料的actions
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    // 为了获取头像
    const baseInfo = await getUserdetailById(result.userId)
    // 将两个接口的返回的数据合并
    const obj = {
      ...result,
      ...baseInfo
    }
    context.commit('setUserInfo', obj)
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  // 退出登录
  logout(context) {
    // 删除用户信息
    context.commit('removeUserInfo')
    // 删除token
    context.commit('removeToken')
    // 重置路由
    resetRouter()
    // 还有一步 vuex中的数据是不是还在
    // 要清空permission中的state数据
    // vuex中 user子模块 permission子模块
    // 子模块调用子模块的action 默认情况下 子模块的context是子模块的
    // 父模块 调用子模块的action
    context.commit('permission/setRoutes', [], {
      root: true
    })
    // 子模块调用子模块的action 可以将commit的第三个参数 设置成 {root:true} 就标识当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: {},
  state,
  mutations,
  actions
}
