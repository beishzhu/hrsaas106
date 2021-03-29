<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 --头部 -->
      <el-card class="tree-card">
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <!-- 放置一个 el-tree -->
        <el-tree :data="departs" :props="defaultProps">
          <tree-tools slot-scope="{data}" :treeNode="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
        <add-dept ref="addDept" :show-dialog.sync="showDialog" :treeNode="node" @addDepts="getDepartments"></add-dept>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils/index.js'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, //显示窗体
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      console.log(result);
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      // 显示弹层
      this.showDialog = true
      this.node = node
      // 父子健调用子子健的实例方法 传入一个id
      // console.log(this.$refs.addDept);
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

