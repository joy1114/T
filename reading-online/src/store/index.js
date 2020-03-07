import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 数据定义 存储
  state: {
    user: {},
    token: '',
  },
  // 获取数据
  getters:{
    User: function(state){
      return state.user
    },
    userCollectArray: function(state){
      var arr = []
      if(state.user.user_collect != null){
        arr = state.user.user_collect.split(',')
        arr = arr.map((item)=> parseInt(item))
        
      }
      return arr
    }
    // User:function(state){
    //   return state.users
    // }
  },
  // 触发事件 改变数据
  mutations: {
    /* 登录 用户信息 登录状态存储 */
    isLogin: function(state,payload){
      console.log('mutations isLogin')
      sessionStorage.setItem('token',payload.token)
      sessionStorage.setItem('user',JSON.stringify(payload.data))
      state.user = payload.data
      state.token = payload.token
      console.log(state.user)
      console.log(state.token)
    },
    /* 新注册用户 登录 */
    isRegister: function(state,payload){
      sessionStorage.setItem('user', JSON.stringify(payload.data.insertId))
      sessionStorage.setItem('token', payload.token)
      state.user.user_id = payload.data.insertId
      state.token = payload.token
    },
    /* 退出登录 清除状态 */
    isLoginOut: state => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      state.user = {}
      state.token = ''
    },
    newCollect: (state,payload) =>{
      state.user.user_collect = (state.user.user_collect).concat(payload, ',')
      sessionStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  // 
  actions: {
    Login: function(context,payload){
      console.log('action Login')
      context.commit('isLogin',payload)
    },
    LoginOut: function(context){
      context.commit('isLoginOut')
    },
    // Register: function(context,payload){
    //   context.commit('isRegister',payload)
    // },
    newCollect: function(context,payload){
      context.commit('newCollect',payload)
    }
  },
  modules: {
  }
})
