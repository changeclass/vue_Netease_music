import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    music: [],
    index: 0
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    clearUser (state) {
      state.user = {}
    },
    setMusic (state, musciList) {
      state.music = musciList
    },
    setIndex (state, newIndex) {
      state.index = newIndex
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
