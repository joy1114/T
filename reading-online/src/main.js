import Vue from 'vue'
import App from './App.vue'
import iconfont from './assets/iconfont/iconfont/iconfont.css'
import router from './router/routers'
import store from './store'
import md5 from "js-md5";
import './plugins/element.js'
import './plugins/vant.js'
import axios from 'axios'
import common from './assets/js/common.js'
import 'default-passive-events'
import Vconsole from 'vconsole'
const vconsole = new Vconsole()
Vue.use(vconsole)
Vue.use(iconfont)
// 统一设置服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 装载
Vue.prototype.$http = axios
Vue.prototype.$md5 = md5

Vue.config.productionTip = false
// 公共方法
Vue.prototype.$common=common

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
