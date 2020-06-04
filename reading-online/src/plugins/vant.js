import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import {Dialog} from 'vant'
import {
    Toast
} from 'vant'
import {
    Lazyload
} from 'vant';

Vue.use(Lazyload);
Vue.use(Vant);
Vue.use(Dialog)
Vue.use(Toast)
// 全局注册
