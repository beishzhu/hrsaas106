<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label='部门名称' prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label='部门编码' prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item label='部门负责人' prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='部门介绍' prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows='3'></el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type='flex' justify='center'>
      <el-col :span='6'>
        <el-button type="primary" size="small" @click="btnOK">确认</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments.js'
import { getEmployeeSimple } from '@/api/employees.js'
export default {
  // 传入一个props 变量来控制 线上或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 定义一个函数 这个函数的目的是 去找同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // depts 是所有的部门数据
      if (this.formData.id) {
        //有id 就是编辑模式  除了我之外 统计部门下不能有叫张三的
        isRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没id 就是添加模式
        // 如果去找技术部所有的子节点
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }

    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 有id 编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 没有id 添加模式
        // 这里加一个value不为空 因为我们的部门历史数据有可能没有code
        isRepeat = depts.some(item => item.code === value && value)
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
        { max: 50, min: 1, message: "部门名称要求1-50个字符", trigger: 'blur' },
        { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
        { max: 50, min: 1, message: "部门编码要求1-50个字符", trigger: 'blur' },
        { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
        { max: 300, min: 1, message: "部门名称要求1-300个字符", trigger: 'blur' }]
      },
      peoples: []
    }
  },
  computed: {
    // 判断标题 显示编辑或新增
    showTitle() {
      return this.formData.id ? "编辑子部门" : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    // 点击确认时触发
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 如果校验通过 就可以调用新增接口提交数据了
          if (this.formData.id) {
            // 如果有id 就是编辑模式 
            await updateDepartments(this.formData)
          } else {
            // 没有id就是新增模式
            // 调用新增接口 添加部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          // 新增成功之后调用父组件重新拉取数据
          this.$emit('addDepts')
          // 关闭弹框 子组件固定写法 （update:props名称，值）
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 点击取消时触发
    btnCancel() {
      // 因为 resetFields 不能重置非表单上的数据 比如id不能重置 所以要再自己手动重置一次表单数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
        this.$emit('update:showDialog', false) // 关闭弹层
      this.$refs.deptForm.resetFields() // 重置校验
    }
  }
}
</script>
