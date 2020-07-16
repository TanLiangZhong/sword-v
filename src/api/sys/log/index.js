import request from '@/utils/request'

const prefixPath = '/system/log/'

export function findPage(data) {
  return request({
    url: `${prefixPath}findPage`,
    method: 'post',
    data
  })
}

