<template>
  <div class="indexMain">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn"
            @click="$router.push('/homePage/homePage')">
            <div class="logo">
              <img :src="logo" />
            </div>
            <div class="name">{{companyName}}</div>
          </div>
          <div class="menuCtn">
            <div class="menu">
              <img class="icon"
                :src=" require('@/assets/image/index/产品.png')" />
              <span class="text"
                @click="$router.push('/proStoreDetail')">产品出入库</span>
            </div>
            <div class="menu">
              <img class="icon"
                :src=" require('@/assets/image/index/采购单.png')" />
              <span class="text"
                @click="$router.push('/yarnOrderCreate')">添加采购单</span>
            </div>
            <div class="menu">
              <img class="icon"
                :src=" require('@/assets/image/index/采购单列表.png')" />
              <span class="text"
                @click="$router.push('/yarnOrderList/page=1')">采购单列表</span>
            </div>
            <div class="menu">
              <img class="icon"
                :src=" require('@/assets/image/index/库存.png')" />
              <span class="text"
                @click="$router.push('/yarnStoreDetail')">物料库存</span>
            </div>
          </div>
        </div>
        <div class="rightCtn">
          <div class="logout"
            @click="logOut">登出系统</div>
        </div>
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
  data () {
    return {
      companyName: '欢迎使用仓储管理系统',
      logo: require('@/assets/image/index/logo.png')
    }
  },
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
