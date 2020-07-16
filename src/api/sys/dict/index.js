import request from '@/utils/request'

const prefixPath = '/system/dict/'

export function findPage(data) {
  return request({
    url: `${prefixPath}findPage`,
    method: 'post',
    data
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

