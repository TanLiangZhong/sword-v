import request from '@/utils/request'

const prefixPath = '/pro/customer/'

export function findPage(data) {
  return request({
    url: `${prefixPath}findPage`,
    method: 'post',
    data
  })
}

