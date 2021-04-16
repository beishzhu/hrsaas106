<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{item.name}}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserdetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [],//角色列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    // 获取用户当前的角色
    async getUserdetailById(id) {
      const { roleIds } = await getUserdetailById(id)
      this.roleIds = roleIds //复制本用户的角色
    },
    // 确定保存
    btnOK() {
      assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    // 取消
    btnCancel() {
      this.roleIds = [] //清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
