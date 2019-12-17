import {
  perlist,
  addPersonnel,
  deletePersonnel,
  upfilePersonnel,
  updatePersonnel,
  deleteBatchPersonnel
} from '../../api/personnel'

export default {
  namespaced: true,
  state: {
    page: 1,
    pagenum: 10,
    keywords: '',
    personnelList: [],
    total: 0,
    selectIdList: []
  },
  mutations: {
    async mu_perlist(state, payload) {
      let result = await perlist(payload.url, payload.data)
      if (result.code === 200) {
        state.personnelList = result.data.personnelList
        state.personnelList.forEach((t) => {
          if (state.selectIdList.indexOf(t._id) >= 0) {
            t._checked = true
          }
        })
        state.total = result.data.total
      }
      payload.cb && payload.cb()
    },
    async mu_addPersonnel(state, payload) {
      let result = await addPersonnel(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_deletePersonnel(state, payload) {
      let result = await deletePersonnel(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_upfilePersonnel(state, payload) {
      let result = await upfilePersonnel(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_updatePersonnel(state, payload) {
      let result = await updatePersonnel(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    async mu_deleteBatchPersonnel(state, payload) {
      let result = await deleteBatchPersonnel(payload.url, payload.data)
      payload.cb && payload.cb(result)
    },
    setPage(state, payload) {
      state.page = payload.page
    },
    setKeywords(state, payload) {
      state.keywords = payload.keywords
    },
    setSelectIdList(state, payload) {
      switch (payload.type) {
        case 'init':
          state.selectIdList = []
          break
        case 'selectOne':
          state.selectIdList.push(payload._id)
          break
        case 'selectOneCancel':
          state.selectIdList = state.selectIdList.filter((t) => {
            return t !== payload._id
          })
          break
        case 'selectAll':
          state.personnelList.forEach((t) => {
            if (state.selectIdList.indexOf(t._id) === -1) {
              state.selectIdList.push(t._id)
            }
          })
          break
        case 'selectAllCancel':
          state.personnelList.forEach((t) => {
            let index = state.selectIdList.indexOf(t._id)
            if (index >= 0) {
              state.selectIdList.splice(index, 1)
            }
          })
          break
        default:
          break
      }
      // console.log(state.selectIdList)
    }
  },
  actions: {
    ac_perlist({
      commit
    }, payload) {
      commit('mu_perlist', payload)
    },
    ac_addPersonnel({
      commit
    }, payload) {
      commit('mu_addPersonnel', payload)
    },
    ac_deletePersonnel({
      commit
    }, payload) {
      commit('mu_deletePersonnel', payload)
    },
    ac_upfilePersonnel({
      commit
    }, payload) {
      commit('mu_upfilePersonnel', payload)
    },
    ac_updatePersonnel({
      commit
    }, payload) {
      commit('mu_updatePersonnel', payload)
    },
    ac_deleteBatchPersonnel({
      commit
    }, payload) {
      commit('mu_deleteBatchPersonnel', payload)
    }
  },
  getters: {}
}
