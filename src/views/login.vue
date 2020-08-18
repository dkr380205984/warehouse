<template>
  <div id="login">
    <!-- 背景组件 -->
    <vue-particles color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="background"></vue-particles>
    <div class="loginCtn">
      <div class="atLeft">
        <el-carousel height="370px"
          indicator-position="none">
          <el-carousel-item v-for="(item,index) in picArr"
            :key="index">
            <img class="rotateImg"
              :src="item" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="atRight">
        <div class="title">仓储管理系统</div>
        <div class="welcome">欢迎登录</div>
        <div class="inputCtn">
          <el-input type="text"
            placeholder="请输入手机号"
            v-model="telephone"
            @keydown.enter="goLogin">
          </el-input>
        </div>
        <div class="inputCtn">
          <el-input type="password"
            placeholder="请输入密码"
            v-model="password"
            @keydown.enter="goLogin">
          </el-input>
        </div>
        <div class="psdOp">
          <el-checkbox v-model="remPsd">记住密码</el-checkbox>
          <div class="fogotPsd">忘记密码？</div>
        </div>
        <div class="loginBtn"
          @click="goLogin">登录</div>
        <div class="regBtn"
          @click="goRegister">注册账号</div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getAuthorization } from '@/assets/js/api.js'
export default {
  name: 'home',
  data () {
    return {
      telephone: window.localStorage.getItem('zhUsername'),
      password: window.localStorage.getItem('zhPassword'),
      remPsd: true,
      picArr: [require('../assets/image/login/rotation1.jpg'), require('../assets/image/login/rotation2.jpg'), require('../assets/image/login/rotation3.jpg'), require('../assets/image/login/rotation4.png')]
    }
  },
  methods: {
    // 登录
    goLogin () {
      const _this = this
      login({
        user_name: _this.telephone,
        password: _this.password
      }).then((res) => {
        if (res.data.code === 200) {
          window.sessionStorage.setItem('token', res.data.data.access_token)
          window.sessionStorage.setItem('token_type', res.data.data.token_type)
          getAuthorization.get().then(resp => {
            if (res.data.status !== false) {
              this.$message.success({
                message: '登录成功',
                duration: 1000
              })
              window.sessionStorage.setItem('user_name', resp.data.data.user_name)
              window.sessionStorage.setItem('company_name', resp.data.data.company_name)
              window.sessionStorage.setItem('logo', resp.data.data.company_logo)
              window.sessionStorage.setItem('telephone', resp.data.data.telephone)
              window.localStorage.setItem('zhUsername', _this.telephone)
              if (_this.remPsd) {
                window.localStorage.setItem('zhPassword', _this.password)
              } else {
                window.localStorage.setItem('zhPassword', '')
              }
              if (_this.$route.query.nextUrl) {
                _this.$router.push(_this.$route.query.nextUrl)
              } else {
                _this.$router.push('/proStoreDetail')
              }
            }
          })
          // window.sessionStorage.setItem('module_id', JSON.stringify(res.data.data.module_id))
          // window.sessionStorage.setItem('has_check', res.data.data.has_check)
          // window.sessionStorage.setItem('user_id', res.data.data.user_id)
          // window.sessionStorage.setItem('group_name', res.data.data.group_name)
        } else {
          this.$message.error({
            message: res.data.message
          })
          _this.password = ''
        }
      })
    },
    // 注册
    goRegister () {
      this.$message.warning({
        message: '注册功能暂不开放'
      })
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/login.less";
</style>
<style lang="less">
//登录页 轮播图的样式
#login {
  .el-carousel__arrow {
    display: none;
  }
  .el-checkbox__label {
    font-size: 12px;
    color: #888888;
    padding-left: 4px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #fff !important;
    background-color: #fff;
    &:hover {
      border-color: #fff !important;
    }
  }
  .el-checkbox__inner::after {
    border-color: #888;
    border-width: 2px;
  }
  .el-checkbox__inner:hover {
    border-color: #fff;
  }
}
</style>
