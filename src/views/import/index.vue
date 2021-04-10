<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>


<script>
import { importEmployee } from '@/api/employees'
export default {
  // 为了让这个页面服务更多的导入功能 在页面中用参数来判断是否导入员工
  data() {
    return {
      // type: this.$router.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      // 实现excel导入
      // if (this.type == 'user') {
      // 如果是导入员工
      const userReslations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userReslations[key] === 'timeOfEntry' || userReslations[key] == 'correctionTime') {
            userInfo[userReslations[key]] = new Date(this.formatDate(item[key], '/')) //只有这样才能入库
            return
          }
          userInfo[userReslations[key]] = item[key]
        })
        // 最终userInfo 变成了全是英文
        arr.push(userInfo)
        // console.log(arr);
      })
      await importEmployee(arr) //调用导入接口

      this.$message.success('导入成功')
      // }
      this.$router.back()//返回上一页
    },
    // excel中有日期格式的时候，实际幻化的值为一个数字，需要一个方法进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
