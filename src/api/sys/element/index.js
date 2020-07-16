import request from '@/utils/request'

const prefixPath = '/system/element/'

export function findByMenuId(id) {
  return request({
    url: `${prefixPath}findByMenuId/${id}`,
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


