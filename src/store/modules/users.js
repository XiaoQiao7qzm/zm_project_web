import { register, login, getUserInfo, uploadHead, exit } from '../../api/users'

export default {
  namespaced: true,
  state: {
    userInfo: {}
  },
  mutations: {
    async mu_register(state, payload) {
      let result = await register(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_login(state, payload) {
      let result = await login(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_getUserInfo(state, payload) {
      let result = await getUserInfo(payload.url, payload.data)
      if(result.code === 200) {
        state.userInfo = result.data
      }
      payload.cb && payload.cb(result)
    },
    async mu_uploadHead(state, payload) {
      let result = await uploadHead(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_exit(state, payload) {
      let result = await exit(payload.url, payload.data)
      payload.cb && payload.cb(result)
    }
  },
  actions: {
    ac_register({commit}, payload) {
      commit('mu_register', payload)
    },
    ac_login({commit}, payload) {
      commit('mu_login', payload)
    },
    ac_getUserInfo({commit}, payload) {
      commit('mu_getUserInfo', payload)
    },
    ac_uploadHead({commit}, payload) {
      commit('mu_uploadHead', payload)
    },
    ac_exit({commit}, payload) {
      commit('mu_exit', payload)
    }
  },
  getters: {}
}