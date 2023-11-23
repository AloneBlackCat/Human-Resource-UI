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
