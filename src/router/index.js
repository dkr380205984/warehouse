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
      name: '添加原料采购单',
      component: () => import('../views/yarnOrderCreate.vue')
    }, {
      path: '/materialOrderCreate',
      name: '添加辅料采购单',
      component: () => import('../views/materialOrderCreate.vue')
    }, {
      path: '/yarnOrderList/:params',
      name: '采购单列表',
      component: () => import('../views/yarnOrderList.vue')
    }, {
      path: '/yarnOrderDetail/:id/:type',
      name: '采购单详情',
      component: () => import('../views/yarnOrderDetail.vue')
    }, {
      path: '/yarnStoreDetail/:type/:isLog',
      name: '物料出入库',
      component: () => import('../views/yarnStoreDetail.vue')
    }, {
      path: '/setting',
      name: '设置',
      component: () => import('../views/setting.vue')
    }]
  }, {
    path: '/print/goStockTable/:id',
    name: 'goStockTable',
    component: () => import('../views/print/goStockTable.vue')
  }, {
    path: '/print/outStockTable/:id',
    name: 'outStockTable',
    component: () => import('../views/print/outStockTable.vue')
  }, {
    path: '/print/backStockTable/:id',
    name: 'backStockTable',
    component: () => import('../views/print/backStockTable.vue')
  }, {
    path: '/print/orderYarnTable/:id',
    name: 'orderYarnTable',
    component: () => import('../views/print/orderYarnTable.vue')
  }, {
    path: '/print/goStockProTable/:id',
    name: 'goStockProTable',
    component: () => import('../views/print/goStockProTable.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
