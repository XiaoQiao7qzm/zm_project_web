<template>
  <div v-show="alertShow" class="alert">
    <Alert :type="alertType" style="text-align: center; height: 40px; line-height: 22px; font-size: 16px;">{{alertTxt}}</Alert>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      alertShow: state => state.alert.alertShow,
      alertType: state => state.alert.alertType,
      alertTxt: state => state.alert.alertTxt
    })
  },
}
</script>
<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
}
</style>