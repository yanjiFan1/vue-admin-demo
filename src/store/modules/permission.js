import { asyncRouterMap, constantRouterMap, noShowRouter } from '@/router'

/**
 * 通过meta.menu判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  // return true
  if (route.meta && route.meta.menu) {
    return menus.some(menu => {
      return route.meta.menu === menu
    })
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合菜单权限的路由表
 * @param asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers.concat(noShowRouter) // 动态添加路由
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          menus
        } = data
        // console.log(menus)
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        // console.log(asyncRouterMap)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
