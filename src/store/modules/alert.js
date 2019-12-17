export default {
  namespaced: true,
  state: {
    alertShow: false,
    alertType: 'error',
    alertTxt: '',
    timer: null
  },
  mutations: {
    setAlertShow(state, payload) {
      if (state.timer) clearTimeout(state.timer);
      state.alertTxt = payload.msg;
      state.alertType = payload.type || 'error';
      state.alertShow = true;
      state.timer = setTimeout(() => {
        state.alertShow = false;
        clearTimeout(state.timer);
        state.timer = null;
      }, 1500);
    }
  },
  actions: {

  },
  getters: {

  }
}