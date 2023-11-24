import request from '@/utils/request'

// 查询权限列表
export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}

// 新增权限点
export function addPermission(data) {
  return request({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

// 删除权限点
export function delPermission(id) {
  return request({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}

// 查询权限点
export function getPermission(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

// 修改权限点数据
export function updatePermission(data) {
  return request({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}
