import request from '@/utils/request'

const prefixPath = '/system/oss/'

export function getToken() {
  return request({
    url: `${prefixPath}token`,
    method: 'get'
  })
}
