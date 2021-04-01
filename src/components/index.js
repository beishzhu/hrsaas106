// 该组件负责所有公共的组件的全局注册 Vue.use
import PageTools from './pageTools'

export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
  }
}
