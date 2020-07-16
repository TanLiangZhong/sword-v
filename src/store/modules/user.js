import { currentUser, login, logout, getCaptcha } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  elementAuthority: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ELEMENT_AUTHORITY: (state, elementAuthority) => {
    state.elementAuthority = elementAuthority
  }
}

const actions = {
  // 获取验证码
  getCaptcha({ commit }) {
    return new Promise((resolve, reject) => {
      getCaptcha().then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      login(username.trim(), password, code, state.token).then(response => {
        // 验证码错误
        const { code, msg, data } = response
        if (code === 'F0005') {
          Message({
            message: msg,
            type: 'warning'
          })
          return Promise.reject('error')
        }

        // 账户名或者密码输入错误
        if (code === 'F0001') {
          Message({
            message: msg,
            type: 'warning'
          })
          return Promise.reject('error')
        }

        // 账号异常
        if (code === 'F0008') {
          Message({
            message: msg,
            type: 'warning'
          })
          return Promise.reject('error')
        }

        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      currentUser().then(response => {
        const { data } = response
        const { menuAuthority, elementAuthority, nickname, avatar, introduction } = data
        commit('SET_ROLES', menuAuthority.length <= 0 ? ['DEFAULT_ROLE'] : menuAuthority)
        commit('SET_ELEMENT_AUTHORITY', elementAuthority)
        commit('SET_NAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(menuAuthority)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
