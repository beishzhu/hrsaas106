<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登陆账户设置">
            <!-- 放置表单 -->
            <el-form :rules="rules" ref="userForm" :model="userInfo" label-width="120px" style="margin-left:120px;margin-top:30px">
              <el-form-item label="姓名" prop="username">
                <el-input style="width:300px" v-model="userInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" type="password" prop="password2">
                <el-input style="width:300px" v-model="userInfo.password2"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置个人详情 -->
            <component :is="userComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="登陆账户设置">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置表单 -->
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserdetailById } from '@/api/user'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info'
export default {
  components: { userInfo, jobInfo },
  data() {
    return {
      userComponent: 'userInfo',
      JobInfo: 'jobInfo',
      userId: this.$route.params.id, //这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        // 存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getUserdetailById()
  },
  methods: {
    async getUserdetailById() {
      this.userInfo = await getUserdetailById(this.userId)
    },
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style>
</style>
