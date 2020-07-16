import request from '@/utils/request'

const prefixPath = '/system/menu/'

export function getTree() {
  return request({
    url: `${prefixPath}tree`,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: `${prefixPath}delete/${id}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `${prefixPath}save`,
    method: 'post',
    data
  })
}
