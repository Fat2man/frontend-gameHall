import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import CusMessage from './plugins/cusMessagePlugin';  // 导入插件
import AXIOS from './request/http'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css'
import '@/assets/font/font.css'
import sound from '@/assets/music/click.wav'
Vue.use(ElementUI);
Vue.use(CusMessage);
Vue.directive('click-sound', {
  bind(el, binding) {
    // 为元素添加点击事件监听
    el.addEventListener('click', () => {
      // 播放音效
      const audio = new Audio(sound);
      audio.play();
    });
  }
});
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/regUser' || to.path === '/111') {
    next()
  } else {
    let token = sessionStorage.getItem('mytoken')
    if (token) {
      next()
    } else {
      next({ path: '/' })
      CusMessage.message('您未登录，请先登录')
    }
  }
})
Vue.config.productionTip = false
Vue.prototype.$AXIOS = AXIOS
Vue.prototype.$basrUrl = process.env.VUE_APP_BASE_URL
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
