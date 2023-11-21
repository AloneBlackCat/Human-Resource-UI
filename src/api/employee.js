import requset from '@/utils/request'

export function getEmployee() {
  return requset({
    url: '/sys/employee'
  })
}
