/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export const systemManagerRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SystemMange',
  meta: {
    title: '系统管理',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/user/index'),
      name: 'UserManage',
      meta: { title: '用户管理', icon: 'el-icon-setting', authority: 'system:manage:user' }
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu/index'),
      name: 'MenuManage',
      meta: { title: '菜单管理', icon: 'el-icon-setting', authority: 'system:manage:menu' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index'),
      name: 'RoleManage',
      meta: { title: '角色管理', icon: 'el-icon-setting', authority: 'system:manage:role' }
    },
    {
      path: 'dict',
      component: () => import('@/views/system/dict/index'),
      name: 'DictManage',
      meta: { title: '数据字典', icon: 'el-icon-setting', authority: 'system:manage:dict' }
    }
  ]
}

export const systemMonitorRouter = {
  path: '/monitor',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SystemMange',
  meta: {
    title: '系统监控',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'http://localhost:1218/api/druid',
      name: 'DictManage',
      meta: { title: '数据监控', icon: 'el-icon-setting' }
    },
    {
      path: 'log',
      component: () => import('@/views/system/log'),
      name: 'LogManage',
      meta: { title: '操作日志', icon: 'el-icon-setting', authority: 'system:manage:log' }
    }
  ]
}
