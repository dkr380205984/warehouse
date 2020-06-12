<template>
  <div class="indexMain">
    <div class="header">
      <div class="main">
        <div class="text1">欢迎登陆仓储管理系统，XXX</div>
        <div class="text2"
          @click="logOut">登出系统</div>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { logout } from '@/assets/js/api.js'
export default {
  methods: {
    logOut () {
      logout().then((res) => {
        if (res.data.status) {
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/index.less";
</style>
