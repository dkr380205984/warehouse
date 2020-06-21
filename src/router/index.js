import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  }, {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
      path: '/proStoreDetail',
      name: '产品出入库',
      component: () => import('../views/proStoreDetail.vue')
    }, {
      path: '/yarnOrderCreate',
      name: '添加采购单',
      component: () => import('../views/yarnOrderCreate.vue')
    }, {
      path: '/yarnOrderList/:params',
      name: '采购单列表',
      component: () => import('../views/yarnOrderList.vue')
    }, {
      path: '/yarnOrderDetail/:id',
      name: '采购单详情',
      component: () => import('../views/yarnOrderDetail.vue')
    }, {
      path: '/yarnStoreDetail',
      name: '物料出入库',
      component: () => import('../views/yarnStoreDetail.vue')
    }]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
