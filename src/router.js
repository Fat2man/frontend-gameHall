import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "Home" */ './views/Home.vue')
    }
  ]
})
