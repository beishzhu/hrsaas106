<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px; width:100%">
    <!-- 左边 -->
    <el-col>
      <span>{{treeNode.name}}</span>
    </el-col>
    <!-- 右边 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{treeNode.manager}}</el-col>
        <el-col>
          <!--下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="add">添加子部门</el-dropdown-item> -->
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <!-- <el-dropdown-item command="add" :disabled="true">添加子部门</el-dropdown-item> -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments.js'
export default {
  // 改组件需要对外开发属性 外部需要提供一个对象 对象里需要有 name manager
  // props 可以用数组来接收数据 也可以用对象来接收
  // props：{ props属性:{ 配置选项}}
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传 treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(command) {
      if (command === 'add') {
        // 添加部门操作 告诉父组件 显示弹层
        this.$emit('addDepts', this.treeNode) //为何传出 treeNode 因为是添加子部门 需要当前部门的数据
      } else if (command === 'edit') {
        // 编辑部门操作
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除操作
        this.$confirm('确认要删除该部门吗? ').then(() => {
          // 如果点击了确认删除就是进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          // 如果删除成功了就会进入到这里 重新获取部门信息
          this.$emit('delDepts')// 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

