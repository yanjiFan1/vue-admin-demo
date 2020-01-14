import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import tagsView from './modules/tagsView'
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
  }
}

const store = new Vuex.Store({
  state,
  modules: {
    app,
    permission,
    user,
    tagsView
  },
  getters
})

export default store
