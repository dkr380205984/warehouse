import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 粒子特效 文档地址：https://www.jianshu.com/p/53199b842d25
import VueParticles from 'vue-particles'
import mycomponent from './components'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.use(mycomponent)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
