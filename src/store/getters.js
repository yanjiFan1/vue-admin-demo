const getters = {
  userInfo: state => state.userInfo,
  sidebar: state => state.sidebar,
  tagsView: state => [],
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
