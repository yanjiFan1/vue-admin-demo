const getters = {
  userInfo: state => state.userInfo,
  sidebar: state => state.app.sidebar,
  tagsView: state => state.tagsView,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
