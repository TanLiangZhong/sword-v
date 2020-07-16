import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuList as GetMenuList } from '@/api/auth/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.authority) {
    // return roles.some(role => route.meta.authority.includes(role))
    return roles.includes(route.meta.authority)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes
 * @param roles
 * @param userMenu
 * @returns {*}
 */
export function filterAsyncRoutes(routes, roles, userMenu) {
  return routes.filter(route => {
    // 判断路由是否与当前用户权限匹配
    if (hasPermission(roles, route)) {
      // 更新路由信息
      if (route.meta && userMenu[route.meta.authority]) {
        route.meta.title = userMenu[route.meta.authority].name
        // route.meta.icon = userMenu[route.meta.authority].icon
      }

      // 递归过滤路由
      if (route.children && route.children.length) {
        route.children = filterAsyncRoutes(route.children, roles, userMenu)
      }
      return true
    }
    return false
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      GetMenuList().then(response => {
        const { data } = response
        const menuData = {}
        data.forEach(menu => {
          menuData[menu.authority] = menu
        })
        // 根据菜单数据整理路由
        const accessedRouters = filterAsyncRoutes(asyncRoutes, roles, menuData)
        commit('SET_ROUTES', accessedRouters)
        resolve(accessedRouters)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
