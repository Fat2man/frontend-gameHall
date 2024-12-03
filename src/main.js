import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import AXIOS from './request/http'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css'
import '@/assets/font/font.css'
import sound from '@/assets/music/click.wav'
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
  if (to.path === '/' || to.path === '/regUser') {
    next()
  } else {
    let token = sessionStorage.getItem('mytoken')
    if (token) {
      next()
    } else {
      next({ path: '/' })
      ElementUI.Message('您未登录，请先登录')
    }
  }
})
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$AXIOS = AXIOS
Vue.prototype.$basrUrl = 'http://8.140.238.198:8000/'
// Vue.prototype.$basrUrl = 'http://127.0.0.1:8000/'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
