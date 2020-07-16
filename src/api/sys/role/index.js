import request from '@/utils/request'

const prefixPath = '/system/role/'

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

export function findLinkIds(params) {
  return request({
    url: `${prefixPath}find/linkIds`,
    method: 'get',
    params
  })
}

export function batchAddRoleLink(data) {
  return request({
    url: `${prefixPath}add/link`,
    method: 'post',
    data
  })
}

export function selectUserByRoleId(params) {
  return request({
    url: `${prefixPath}selectUserByRoleId`,
    method: 'get',
    params
  })
}

export function relatedUser(data) {
  return request({
    url: `${prefixPath}relatedUser`,
    method: 'post',
    data
  })
}

export function cancelRelatedUser(data) {
  return request({
    url: `${prefixPath}cancelRelatedUser`,
    method: 'delete',
    data
  })
}
