<template>
    <div class="register">
		<div class="register-nav-bar">
			<van-nav-bar
			title="注册"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
			/>
		</div>
        <van-form ref="registerform" @submit="onSubmit" validate-first @failed="onFailed">
            <van-field
                v-model="ruleForm.user_tel"
                name="user_tel"
                type="number"
                label="手机号"
                right-icon="warning-o"
                clearable
                placeholder="请输入手机号"
                :rules="[{ required: true, pattern: reg_tel, trigger: 'onBlur',message: '请输入正确手机号' }]"
            />
			<van-field
                v-model="ruleForm.user_name"
                name="user_name"
                type="text"
                label="昵称"
                right-icon="warning-o"
                clearable
                placeholder="请输入昵称"
                :rules="[{ required: true, pattern: reg_name, trigger: 'onBlur',message: '请输入正确格式' }]"
            />
            <van-field
                v-model="ruleForm.user_pass1"
                type="password"
                name="user_pass1"
                label="密码"
                left-icon="warning-o"
                clearable
                placeholder="请输入密码"
                :rules="[{ required: true, pattern: reg_pass, trigger: 'onBlur',message: '请输入正确格式' }]"
            />
			<van-field
                v-model="ruleForm.user_pass2"
                type="password"
                name="user_pass2"
                label="确认密码"
                left-icon="warning-o"
                clearable
                placeholder="请再次输入密码"
                :rules=" [{ required: true, validator: validatePass2, trigger: 'onBlur',message: '两次输入密码不一致' }]"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                注册并登录
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import { Toast } from 'vant';
export default {
	name: "Register",
	data() {		
		return {
			// 验证密码 以字母开头 只能包含字母、数字和下划线
			reg_pass: /^[a-zA-Z]\w{6,15}$/,
			// 验证手机号 以1开头 11位
			reg_tel: /^[1]\d{10}$/,
			// 验证用户名  可以由字母、数字、下划线和中文组成，以中文或字母开头，6-16位
			reg_name: /^([a-zA-Z]|[\u4e00-\u9fa5]){1}([a-zA-Z0-9]|[\u4E00-\u9FA5]|[-]){0,14}$/,
			ruleForm: {
				user_id: 0,
				user_tel: '',
				user_name: '',
				user_pass1: '',
				user_pass2: '',
				user_photo: '',
				user_tips: '',
				user_collect: '',
				user_sex: '',
				user_born: '',
			},
		};
	},
	methods: {
		// 再次验证密码 第二次与第一次要保持一样
		validatePass2(value){
			return this.ruleForm.user_pass1 === value
		},
		onSubmit(value) {
			var that = this
			Toast.loading({
				message: '注册中...',
				forbidClick: true
			})
			// 登录请求
			console.log('请求')
			that.$http.post("/user/register", {
				user_tel: value.user_tel,
				user_pass: value.user_pass2,
				user_name: value.user_name
			})
			.then(function (res) {
				if (res.data.state == 200) {
					// console.log(res.data.data.insertId)
					that.$delete(that.ruleForm,'user_pass1')
					that.$delete(that.ruleForm,'user_pass2')
					that.ruleForm.user_id = res.data.data.insertId
					that.$store.dispatch('Register',that.ruleForm)
					Toast.success(res.data.msg)
					that.$router.push({
					path: that.$route.query.redirect || '/首页'
				})
				}else {
					Toast.fail(res.data.msg)
				}
			})
			.catch(function (err) {
				Toast.fail("出错了"+err)
			})
		},
		onFailed(errorInfo) {
			console.log('failed', errorInfo);
		},
		onClickLeft() {
			console.log(sessionStorage.getItem('history'))
			let arr = sessionStorage.getItem('history').split(',')
			let from = arr.pop()
			console.log(from)
			let history = ''
			arr.map((item) => history=history+ ','+item )
			console.log(history)
			sessionStorage.setItem('history',history)
			this.$router.push({
				path: from || '/首页'
			})
		},
  }
};
</script>
<style scoped>
</style>
