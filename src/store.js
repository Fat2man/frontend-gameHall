import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    socket: {},//全局共享的socket实例
  },
  mutations: {
    setUserInfo(state, e) {
      state.userInfo = e.userInfo
      sessionStorage.setItem('userInfo', JSON.stringify(e.userInfo))
      sessionStorage.setItem('mytoken', JSON.stringify(e.token))
    },
    setSocket(state, e) {
      state.socket = e.socket
    }
  },
  actions: {

  }
})
