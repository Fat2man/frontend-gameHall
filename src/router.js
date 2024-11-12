import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login.vue'
import login1 from '@/views/login1.vue'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: login
    // },
    {
      path: '/',
      name: 'login1',
      component: login1
    },
    {
      path: '/regUser',
      name: 'regUser',
      component: () => import(/* webpackChunkName: "regUser" */'./views/regUser.vue')
    },
    {
      path: '/Index',
      name: 'Index',
      component: () => import(/* webpackChunkName: "Home" */ './views/Index.vue')
    },
    {
      path: '/chatRoom',
      name: 'chatRoom',
      component: () => import(/* webpackChunkName: "Home" */ './views/chat/chatRoom.vue')
    },
    {
      path: '/pokerHall',
      name: 'pokerHall',
      component: () => import(/* webpackChunkName: "Home" */ './views/pocker/pokerHall.vue')
    },
    {
      path: '/pokerRoom',
      name: 'pokerRoom',
      component: () => import(/* webpackChunkName: "Home" */ './views/pocker/pokerRoom.vue')
    }
  ]
})
