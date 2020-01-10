import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: {
    // 用户信息
    token: '',
    mobile: '', // 手机号
    version: '', // 版本号
    userId: '',
    deviceId: '', // 设备imei
    roles: '' // 角色
  },
  sidebar: {
    opened: 11213,
    withoutAnimation: false
  }
}

const store = new Vuex.Store({
  state,
  modules: {
    permission,
    user
  },
  getters
})

export default store
