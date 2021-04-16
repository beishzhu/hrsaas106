// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
  path: '/employees', // 路径
  name: 'employees',
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
      path: '', // 这里当二级路由的path 什么都不写的时候 标识该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'),
      name: 'employees',
      meta: {
        title: '员工管理', // meta属性里面的属性 随意定义 但这里为什么要用title呢 因为左侧导航会读取我们的理由里的meta里面的title座位显示菜单名称
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', //query传参 动态路由传参  detail/:id?  如果加了？ 表示id可传可不传
      component: () => import('@/views/employees/detail'),
      hidden: true, //不在左侧菜单显示
      meta: {
        title: '员工详情' //标记当前路由规则的中文名称 后续咋做左侧菜单时使用
      }
    },
    // 创建打印页面路由
    {
      path: 'print/:id', //二级默认路由
      component: () => import('@/views/employees/print'), //按需加载
      hidden: true,
      meta: {
        title: '打印',
        icon: 'people'
      }
    }
  ]
}
