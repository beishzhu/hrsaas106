<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请输入入职时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input @focus="getDepartments" v-model="formData.departmentName" style="width:50%" placeholder="请输选择部门">
        </el-input>
        <!-- 放置一个tree组件 -->
        <el-tree @node-click="selectEmployee" :props="{label:'name'}" :default-expand-all="true" v-if="showTree" v-loading="loading" :data="treeData"></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间"></el-date-picker>
      </el-form-item>
    </el-form>

    <!-- fotter插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span='6'>
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      treeData: [],//定义数组接收树形数据
      showTree: false, //控制树形的显示或隐藏
      loading: false,//控制树的显示或隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 1, max: 4, message: '用户名为1-4位', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机格式不正确', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts 是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectEmployee(node) {
      console.log(node.name);
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 点击确定按钮
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        addEmployee(this.formData) // 调用增接口
        // 调用父子件更新页面信息
        this.$parent.getEmployeeList()
        // 关闭弹层
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error);
      }
    },
    // 取消按钮
    btnCancel() {
      // 重置原来表单
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() //重置验证结果
      // 关闭弹框 子组件固定写法 （update:props名称，值）
      this.$emit('update:showDialog', false) //定义一个自定义事件
    }
  }
}

</script>
