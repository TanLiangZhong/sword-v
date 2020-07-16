import request from '@/utils/request'

const prefixPath = '/system/auth/'

export function getCaptcha() {
  return request({
    url: '/system/kaptcha/captcha',
    method: 'get',
    params: {}
  })
}

export function login(username, password, captcha, token) {
  return request({
    url: prefixPath + 'login',
    method: 'post',
    data: {
      username,
      password,
      captcha,
      token
    }
  })
}

export function logout() {
  return request({
    url: prefixPath + 'logout',
    method: 'post'
  })
}

export function currentUser() {
  return request({
    url: prefixPath + 'currentUser',
    method: 'get'
  })
}

export function getMenuList() {
  return request({
    url: '/system/menu/findListByUserId',
    method: 'get'
  })
}

export function updatePassWord(passWord, newPassWord) {
  return request({
    url: prefixPath + 'updatePassWord',
    method: 'put',
    data: {
      passWord,
      newPassWord
    }
  })
}
