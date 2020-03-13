<template>
	<el-container>
		<el-header>
			<img src="" alt="书城logo">
			<h1>欢迎注册享看书城!</h1>
			<span>kankanakn看</span>
		</el-header>
		<el-main>
			<el-form :model="ruleForm"
			status-icon :rules="rules"
			ref="ruleForm" label-width="100px"
			class="demo-ruleForm">
				<el-form-item label="手机号" prop="user_tel">
					<el-input type="text"
					v-model.Number="ruleForm.user_tel"
					placeholder="请输入11位手机号"
					autocomplete="off" 
					style="width: 400px;" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="user_name">
					<el-input type="text"
					v-model="ruleForm.user_name"
					placeholder="以中文或字母开头,可以包含数字和下划线,1-15位"
					autocomplete="off"
					style="width: 400px;" clearable></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="user_pass1">
					<el-input type="password"
					v-model="ruleForm.user_pass1"
					placeholder="以字母开头,可以包含数字和下划线,6-15位"
					autocomplete="off"
					style="width: 400px;" clearable></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="user_pass2">
					<el-input type="password"
					v-model="ruleForm.user_pass2"
					placeholder="请再次输入密码"
					autocomplete="off"
					style="width: 400px;" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"
					@click="submitForm('ruleForm')" :loading="true" style="width: 400px;">注册并登录</el-button>
				</el-form-item>
			</el-form>
		</el-main>
	</el-container>
</template>
<script>
export default {
	name: "register",
	data() {
		var reg_pass = /^[a-zA-Z]\w{6,15}$/;
		var reg_tel = /^[1]\d{10}$/;
		var reg_name = /^([a-zA-Z]|[\u4e00-\u9fa5]){1}([a-zA-Z0-9]|[\u4E00-\u9FA5]|[-]){0,14}$/ 
		
		// 验证手机号 以1开头 11位
		var validateTel = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'));
			}else if (!reg_tel.test(value)) {
				callback(new Error('请输入正确的手机号'));
			}else {
				if (this.ruleForm.user_name !== '') {
				this.$refs.ruleForm.validateField('user_name');
				}
				callback();
			}
		};
		// 再次验证密码 第二次与第一次要保持一样
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			}else if ( value !== this.ruleForm.user_pass1 ){
				callback(new Error('两次密码不一致'));
			}else{
				callback();
			}
		};
		// 验证密码 以字母开头 只能包含字母、数字和下划线
		var validatePass1 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			}else if ( !reg_pass.test(value) ){
				callback(new Error('密码必须以字母开头，只能包含字母、数字和下划线'));
			}else {
				if (this.ruleForm.user_pass2 !== '') {
				this.$refs.ruleForm.validateField('user_pass2');
				}
				callback();
			}
		};
		// 验证用户名  可以由字母、数字、下划线和中文组成，以中文或字母开头，6-16位
		var validateName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入用户名'));
			}else if ( !reg_name.test(value) ){
				callback(new Error('用户名必须由6-10位数字和字母组成'));
			}else {
				if (this.ruleForm.user_pass1 !== '') {
				this.$refs.ruleForm.validateField('user_pass1');
				}
				callback();
			}
		};
		return {
			ruleForm: {
				user_id: 0,
				user_tel: '',
				user_name: '',
				user_pass1: '',
				user_pass2: '',
				user_photo: '',
				user_tips: '',
				user_collect: '',
			},
			rules: {
				user_tel: [
					{ required: true, validator: validateTel, trigger: 'blur' }
				],
				user_pass1: [
					{ required: true, validator: validatePass1, trigger: 'blur' }
				],
				user_pass2: [
					{ required: true, validator: validatePass2, trigger: 'blur' }
				],
				user_name: [
					{ required: true, validator: validateName, trigger: 'blur' }
				],
			}
		};
	},
	
	methods: {
		submitForm(formName) {
			var that = this;
			that.$refs[formName].validate((valid) => {
				if (valid) {
					// alert('submit success')
					// 登录请求
					console.log('请求')
					that.$http.post("/user/register", {
						user_tel: that.ruleForm.user_tel,
						user_pass: that.ruleForm.user_pass2,
						user_name: that.ruleForm.user_name
					})
					.then(function (res) {
						
						if (res.data.state == 1) {
							console.log(res.data.data.insertId)
							that.$delete(that.ruleForm,that.ruleForm.user_pass1)
							that.$delete(that.ruleForm,that.ruleForm.user_pass2)
							that.ruleForm.user_id = res.data.data.insertId
							that.$store.dispatch('Register',that.ruleForm)
							alert(res.data.msg)
							that.$router.push({
							path: that.$route.query.redirect || '/home'
						})
						}else {
							that.waitRegister = false
							alert(res.data.msg)
						}
					})
					.catch(function (err) {
						console.log(err);
					});
				} else {
					that.waitRegister = false
					console.log('error submit!!');
					return false;
				}
			});
		},
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
  }
};
</script>
<style scoped>
li,
a {
  text-decoration: none;
  list-style: none;
}
.el-main{
	margin: 0 auto;
}

</style>
