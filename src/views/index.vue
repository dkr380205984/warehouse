<template>
  <div class="indexMain">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn">
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
            style="margin-right:20px"
            @click="addUserFlag = true">新增帐号</div>
          <div class="logout"
            @click="logOut">登出系统</div>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="popup"
      v-show="addUserFlag">
      <div class="main">
        <div class="title">
          <div class="text">添加新用户</div>
          <i class="el-icon-close"
            @click="addUserFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">手机号：</div>
            <div class="info">
              <el-input placeholder="请输入手机号"
                v-model="telephone"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">用户名：</div>
            <div class="info">
              <el-input placeholder="请输入用户名"
                v-model="username"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">姓名：</div>
            <div class="info">
              <el-input placeholder="请输入姓名"
                v-model="name"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="addUserFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveUser">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logout, userManage } from '@/assets/js/api.js'
export default {
  data () {
    return {
      username: '',
      telephone: '',
      name: '',
      addUserFlag: false,
      companyName: window.sessionStorage.getItem('company_name'),
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
    },
    saveUser () {
      userManage.create({
        telephone: this.telephone,
        name: this.name,
        user_name: this.username
      }).then((res) => {
        this.$message.success('添加成功,密码初始化为电话号码')
        this.addUserFlag = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/index.less";
</style>
