import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import users from './modules/users'
import personnel from './modules/personnel'
import alert from './modules/alert'

export default new Vuex.Store({
  modules: {
    users,
    personnel,
    alert
  }
})
