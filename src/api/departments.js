import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据id 根据部分 接口是根据restful的规则设计的  删除 delete 新增 post 修改 put 获取 get
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 添加子部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 根据ID查询部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}


// 根据id修改部门详情
export function updateDepartments(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
