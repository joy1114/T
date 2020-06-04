import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 数据定义 存储
  state: {
    user: JSON.parse(sessionStorage.getItem('user')),
    shelf: JSON.parse(sessionStorage.getItem('shelf')),
    token: sessionStorage.getItem('token') === null?false:'token',
    latelyRead: JSON.parse(sessionStorage.getItem('latelyRead')),
    isReadedText: sessionStorage.getItem('isReadedText'),
  },
  // 获取数据
  getters:{
    // 登录状态
    Token: function(state){
      return state.token
    },
    // 登录用户信息
    User: function(state){
      if(state.user===null)
      {
        return {user_id: -1}
      }
      return state.user
    },
    // 用户书架列表数据
    userShelfArray: (state) => ()=>{
      var arr = []
      if (state.token && state.shelf.length) {
        state.shelf.map((item, index) => {
          arr[index] = parseInt(item.book_id)
        })
        return arr
      }
      return arr
    },
    // 用户最近阅读列表数据
    userLatelyReadArray: (state) => ()=>{
      var arr = [
        [],
        []
      ]
      if (state.token && state.latelyRead.length) {
        state.latelyRead.map((item, index) => {
          arr[0][index] = item.book_id
          arr[1][index] = item.chapter
        })
        return arr
      }
      return arr
    },
    // 该书籍用户是否读过
    bookIsReaded:(state) => () => {
      return state.isReadedText
    },
  },
  // 触发事件 改变数据
  mutations: {
    /* 登录 用户信息 登录状态存储 */
    isLogin: function(state,payload){
      sessionStorage.setItem('token',payload.token)
      sessionStorage.setItem('user',JSON.stringify(payload.data))
      state.user = payload.data
      state.token = payload.token
    },
    // 书架列表数据改变
    shelfData: function(state,payload){
      sessionStorage.setItem('shelf',JSON.stringify(payload))
      state.shelf = payload
    },
    // 最近阅读数据改变
    latelyReadData: function(state,payload){
      sessionStorage.setItem('latelyRead', JSON.stringify(payload))
      state.latelyRead = payload
    },
    /* 新注册用户 登录 */
    isRegister: function(state,payload){
      sessionStorage.setItem('user', JSON.stringify(payload))
      sessionStorage.setItem('token', 'token')
      state.user = payload
      state.token = 'token'
    },
    /* 退出登录 清除状态数据 */
    isLoginOut: state => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('shelf')
      sessionStorage.removeItem('latelyRead')
      sessionStorage.removeItem('history')
      state.user = {}
      state.token = ''
      state.shelf = []
      state.latelyRead = []
    },
    /* 收藏书籍 更新用户书架信息 */
    addShelf: (state,bookid) =>{
      let newData = {
        user_id: state.user.user_id,
        book_id: bookid,
      }
      state.shelf.push(newData)
      sessionStorage.setItem('shelf', JSON.stringify(state.shelf))
    },
    // 最近阅读书籍增加
    addLatelyRead: function(state,params){
      state.latelyRead.push([params])
      sessionStorage.setItem('latelyRead',JSON.stringify(state.latelyRead))
    },
    updateLatelyRead:function(state,params){
      let isHas = false
      if(state.latelyRead.length){
        state.latelyRead.map((item,index)=>{
          if(item.book_id === params.book_id){
            state.latelyRead[index].chapter = params.chapter
            isHas = true
            return
          }
        })
        if(!isHas){
          state.latelyRead.push(params)
        }
      }else{
        state.latelyRead[0] = params
      }
      sessionStorage.setItem('latelyRead',JSON.stringify(state.latelyRead))
    },
    // 阅读书籍 改变该书籍的是否阅读状态
    isReaded: function(state, isReadedtext) {
      state.isReadedText = isReadedtext,
      sessionStorage.setItem('isReadedText', state.isReadedText)
    },
    /* 书架编辑删除事件 */
    deleteShelfBook: function(state,deletedids){
      let arr = []
      state.shelf.map((item,index) => {
        arr[index] = parseInt(item.book_id)
      })
      console.log(arr)
      for(let i = state.shelf.length-1;i>=0;i--){
        console.log(deletedids.indexOf(arr[i]))
        if(!(deletedids.indexOf(arr[i])===-1)){
          state.shelf.splice(i,1)
          console.log(state.shelf)
        }
      }
      sessionStorage.setItem('shelf', JSON.stringify(state.shelf))
    },
    /* 上传头像 更新用户状态 */
    uploadPhoto: function(state,url){
      state.user.user_photo = url
      sessionStorage.setItem('user',JSON.stringify(state.user))
    },
    
  },
  // 异步操作  保证数据和视图同步更新
  actions: {
    Login: function(context,payload){
      console.log('action Login')
      context.commit('isLogin',payload)
    },
    LoginOut: function(context){
      context.commit('isLoginOut')
    },
    Register: function(context,payload){
      context.commit('isRegister',payload)
    },
    AddShelf: function (context,bookid) {
      context.commit('addShelf',bookid)
    },
    AddLatelyRead: function(context,params){
      context.commit('addLatelyRead',params)
    },
    UploadPhoto: function(context,url){
      context.commit('uploadPhoto',url)
    },
    ShelfData: function(context,payload){
      context.commit('shelfData',payload)
    },
    LatelyReadData: function(context, payload) {
      context.commit('latelyReadData', payload)
    },
    UpdateLatelyRead: function(context,params){
      context.commit('updateLatelyRead',params)
    },
    IsReaded: function(context,isReadedtext){
      context.commit('isReaded', isReadedtext)
    },
    DeleteShelfBook: function(context,deletedids){
      context.commit('deleteShelfBook',deletedids)
    },

  },
  modules: {
  }
})
