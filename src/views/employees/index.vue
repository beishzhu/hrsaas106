<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- pageTools 组件使用 -->
      <page-tools :show-before="true">
        <span slot="before">总共{{query.total}}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="序号" sortable="" type="index"></el-table-column>
          <el-table-column label="姓名" sortable="" prop="username"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="{row}">
              <img @click="showQrCodes(row.staffPhoto)" v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber"></el-table-column>
          <el-table-column :formatter="formatEmployment" label="聘用形式" sortable="" prop="formOfEmployment"></el-table-column>
          <el-table-column label="部门" sortable="" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              <!-- 作用域插槽 -->
              {{row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align='middle' style="height:60px">
          <el-pagination layout="prev, pager, next" :page-size="query.size" :current-page="query.page" :total="query.total" @current-change="changePage">
          </el-pagination>
        </el-row>
      </el-card>

      <!-- 二维码弹层 -->
      <el-dialog title="二维码" :visible.sync="showDialogQrCode">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas"></canvas>
        </el-row>
      </el-dialog>
    </div>
    <!-- 防止新增组件 -->
    <!-- sync 子组件去改变父组件数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import Qrcode from 'qrcode'
export default {
  components: { AddEmployee },
  data() {
    return {
      loading: false,
      list: [],
      query: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false,
      // 二维码弹层
      showDialogQrCode: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.query)
      this.query.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // console.log(row);
      // console.log(cellValue);
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : "未知"
    },
    // 删除员工
    async delEmployee(id) {
      try {
        console.log(id);
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error);
      }
    },
    // 导出 excel 数据
    exportData() {
      // 做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.query.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          multiHeader, //复杂表头
          merges//合并选项
        })
      })
    },

    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组 [{}] =》[[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 显示二维码
    showQrCodes(url) {
      //  url 存在的情况下才弹出层
      if (url) {
        // 数据更新了 但是我们的弹层会立刻出现吗 页面的渲染是异步的
        this.showDialogQrCode = true
        // 有一个方法可以在上一次数据更新完毕 页面渲染完毕之后
        this.$nextTick(() => {
          //此时可以确认依据有ref对象了,将地址转化成二维码
          Qrcode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>
</style>
