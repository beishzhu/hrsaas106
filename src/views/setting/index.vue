<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片 -->
      <el-card>
        <el-tabs>
          <!-- 左边 -->
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDalog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border :data="list">
              <el-table-column type="index" align="center" label="序号" width="120px"></el-table-column>
              <el-table-column prop="name" label="名称" width="240px"></el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.pagesize" :total="page.total" @current-change='changePage'></el-pagination>
            </el-row>
          </el-tab-pane>

          <!-- 右边 -->
          <el-tab-pane label="公司信息">
            <el-alert show-icon :closable="false" title="消息提示的文案" type="info">
            </el-alert>
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :col="3"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 编辑对话框 -->
        <el-dialog title="编辑角色" :visible="showDalog" @close="btnCancel">
          <el-form :model="roleDate" :rules="roleRules" ref="roleRef" label-width="120px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleDate.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleDate.description"></el-input>
            </el-form-item>
          </el-form>
          <!-- 按钮 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" @click="btnCancel">取消</el-button>
              <el-button size="small" type="primary" @click="btnOK">确认</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible="showPrmDialog" @close="btnPermCancel">
          <!-- 权限是一棵树 -->
          <!-- 将数组绑定到组件上 -->
          <!-- check-strictly 如果为true 那表示父子勾选是 不互相关联 如果为false 就互相关联 -->
          <!-- id 作为唯一标识 -->
          <el-tree ref="permTree" :data="permData" :props="defaultProps" :show-checkbox="true" :check-strictly="true" :default-expand-all="true" :default-checked-keys="selectCheck" node-key="id">

          </el-tree>
          <!-- 确定 取消 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button type="primary" size="small" @click="btnPermOK">确认</el-button>
              <el-button size="small" @click="btnPermCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting.js'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'

import { getPermissionList } from '@/api/permisson'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 保存公司信息
      formData: {},
      // 保存角色信息
      roleDate: {},
      // 显示弹层
      showDalog: false,
      // 校验规则
      roleRules: {
        name:
          [{ required: true, message: '角色名称不能为空! ', trigger: 'blur' }]
      },
      showPrmDialog: false, // 控制分配权限弹层的显示
      defaultProps: {
        label: 'name',
      },
      permData: [],// 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收已选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  computed: {
    ...mapGetters(["companyId"])
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 分页
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 根据id删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗? ')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error);
      }
    },
    // 根据id 获取角色信息并回填编辑
    async editRole(id) {
      this.showDalog = true
      this.roleDate = await getRoleDetail(id)
    },
    // 点击确认按钮 做校验 调更新接口
    // description() { }
    async btnOK() {
      try {
        await this.$refs.roleRef.validate()
        if (this.roleDate.id) {
          // 表单校验通过后才 调用接口更新数据
          // roleDate 有id就是编辑
          await updateRole(this.roleDate)
        } else {
          // roleDate 没有id 就是新增
          await addRole(this.roleDate)
        }
        this.showDalog = false
        this.getRoleList()
        this.$message.success('更新角色信息成功')
      } catch (error) {
        console.log(error);
      }

    },
    btnCancel() {
      // 删除校验信息
      this.$refs.roleRef.resetFields()
      // 清空表单数据
      this.roleDate = {
        name: '',
        description: ''
      }
      // 关闭弹层
      this.showDalog = false
    },
    // 点击分配权限
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0') //转化list 到树形数据
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id) // permIds 是当前角色所拥有的权限点数据
      this.selectCheck = permIds
      this.showPrmDialog = true
    },
    async btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys());
      // console.log(permIds);
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPrmDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPrmDialog = false
    }
  }
}
</script>

<style>
</style>
