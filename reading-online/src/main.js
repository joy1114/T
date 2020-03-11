import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from "js-md5";
import './plugins/element.js'
import axios from 'axios'
import common from './assets/js/common.js'

// 统一设置服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 装载
Vue.prototype.$http = axios
Vue.prototype.$md5 = md5

Vue.config.productionTip = false
// 公共方法
Vue.prototype.common=common

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
