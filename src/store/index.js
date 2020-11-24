import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    clearUser (state) {
      state.user = {}
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getUser: (state) => {
      return state.user
    }
  }
})
