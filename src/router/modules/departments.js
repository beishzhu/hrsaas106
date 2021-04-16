import Layout from '@/layout'
export default {
  path: '/departments', // 路径
  name: 'departments',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '', // 这里当二级路由的path 什么都不写的时候 标识该路由为当前二级路由的默认路由
    component: () => import('@/views/departments'),
    name: 'departments',
    meta: {
      title: '组织架构', // meta属性里面的属性 随意定义 但这里为什么要用title呢 因为左侧导航会读取我们的理由里的meta里面的title座位显示菜单名称
      icon: 'tree'
    }
  }]
}
