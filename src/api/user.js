import request from '@/utils/request'

export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 封装获取用户基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据id获取员工基本信息
export function getUserdetailById(id) {
  return request({
    url: `/sys/user/${id}`
    // 因为axios 默认就是get方式 不用谢 method:'get'
  })
}

export function logout() {

}
