<template>
  <div style="width: 100%; height: 100%;">
    <User :type="'login'"></User>
  </div>
</template>

<script>
import User from "../../../components/user";
export default {
  components: {
    User
  }
};
</script>

<style lang="scss" scoped>
</style>