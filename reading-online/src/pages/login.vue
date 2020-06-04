<template>
    <div>
        <div class="login-nav-bar">
			<van-nav-bar
			title="登录"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
			/>
		</div>
        <van-form ref="loginform" @submit="onSubmit" validate-first @failed="onFailed">
            <van-field
                v-model="user_tel"
                name="user_tel"
                type="number"
                label="手机号"
                right-icon="warning-o"
                clearable
                placeholder="手机号"
                :rules="[{ required: true,pattern: reg_tel,trigger: 'onBlur',message: '请输入正确手机号' }]"
            />
            <van-field
                v-model="user_pass"
                type="password"
                name="user_pass"
                label="密码"
                right-icon="warning-o"
                clearable
                placeholder="密码"
                :rules="[{ required: true,trigger: 'onBlur',message: '请输入密码' }]"
            />
            <div class="form-button" style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                登录
                </van-button>
                <van-button round block type="info" @click="register">
                注册
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  name: "Login",
  data() {
	return {
        reg_tel: /^[1]\d{10}$/,
        user_tel: '',
        user_pass: '',
        id: 0,
      }
  },
  methods: {
    onSubmit:async function(values) {
        var that = this
        Toast.loading({
            message: '登录中...',
            forbidClick: true
        })
        await that.getLogin(values)
        if(that.id){
            /* 书架 */
            await that.getShelf(that.id)
            /* 最近阅读 */
            await that.getLately(that.id)
            //如果之前访问过需要权限的路由，则登陆之后跳转到原来访问的路由，否则跳转到首页
            Toast.success('登录成功！');
            that.$router.push({
                path: that.$route.query.redirect || "/首页"
            })
        }
    },
    getLogin: async function(values){
        var that = this
        await that.$http.post("/user/login", {
                user_tel: values.user_tel,
                user_pass: values.user_pass,
            }).then(function (res) {
                if (res.data.state == 200) {
                    //保存登陆态
                    that.$store.dispatch('Login',res.data)
                    that.id = res.data.data.user_id  
                } else{
                    Toast.fail(res.data.msg)
                }
            }).catch(function (err) {
                Toast.fail('出错了'+err);
            })
    },
    getLately: async function(id){
        var that = this
        await that.$http.get('user/latelyread?user_id='+id).then(res => {
                    if(res.data.state === 200){
                        that.$store.dispatch('LatelyReadData',res.data.data)
                    }
                }).catch( err => {
                    console.log(err)
                })
    },
    getShelf: async function(id){
        var that = this
        await that.$http.get('user/shelfcontent?user_id='+id).then(res => {
                    if(res.data.state === 200){
                        that.$store.dispatch('ShelfData',res.data.data)
                    }
                }).catch( err => {
                    console.log(err)
                })
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo);
    },
    register(){
    this.$router.push({
        path: '/注册',
        query:{
        redirect: this.$route.query.redirect
        }
    })
    },
    onClickLeft() {
        console.log(this.$route.query.redirect)
        this.$router.push({
            path: "/首页"
        })
    },
  }
};
</script>
<style scoped>
.form-button{
    margin: 16px;
}
.form-button .van-button{
    margin-top: 10px;
}
</style>
