<template>
		<el-container>
			<el-header>
				<img src="" alt="书城logo">
				<h1>欢迎登录享看书城!</h1>
				<span>kankanakn看</span>
			</el-header>
			<el-main>
				<el-form :model="ruleForm"
				status-icon :rules="rules"
				ref="ruleForm" label-width="100px"
				class="demo-ruleForm">
					<el-form-item label="帐号" prop="user_tel">
						<el-input type="text"
						v-model.Number="ruleForm.user_tel"
						placeholder="请输入帐号"
						autocomplete="off" style="width: 400px;"
						clearable></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="user_pass">
						<el-input type="password"
						v-model="ruleForm.user_pass"
						placeholder="请输入密码"
						autocomplete="off" style="width: 400px;"
						clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary"
						@click="login('ruleForm')" style="width: 400px;">登 录</el-button>
					</el-form-item>
					<el-form-item>
							<el-button @click="register" style="width: 400px;">注 册</el-button>
					</el-form-item>
				</el-form>
			</el-main>
		</el-container>
</template>
<script>
export default {
  name: "login",
  data() {
			// var regpass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
			var regtel = /^1?[1-9]{10}$/;
			var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入帐号'));
        }else if (!regtel.test(value)) {
					callback(new Error('请输入11位手机号'));
        }else {
          if (this.ruleForm.user_pass !== '') {
            this.$refs.ruleForm.validateField('user_pass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else {
          callback();
        }
      };
			return {
        ruleForm: {
          user_tel: '',
          user_pass: '',
        },
        rules: {
          user_tel: [
            { validator: validateName, trigger: 'blur' }
          ],
          user_pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        }
      };
  },
  // computed: {
  //   user(){

  //   }
  // },
	
  methods: {
		login(formName) {
				var that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            // 登录请求
						console.log('请求')
            that.$http.post("/user/login", {
                user_tel: that.ruleForm.user_tel,
                user_pass: that.ruleForm.user_pass,
              })
              .then(function (res) {
								console.log('返回')
                if (res.data.state == 3) {
                  //保存登陆态
                  that.$store.dispatch('Login',res.data)
                  //如果之前访问过需要权限的路由，则登陆之后跳转到原来访问的路由，否则跳转到首页
                  that.$router.push({
                    path: that.$route.query.redirect || "/home"
                  })
            
                  /* that.$router.push('/home') */
                } else{
									alert(res.data.msg)
                }
              })
              .catch(function (err) {
                console.log(err)
              });
          } else {
						console.log('error submit!!')
            return false
          }
        });
      },
      register(){
        this.$router.push({
          path: '/register',
          query:{
            redirect: this.$route.query.redirect
          }
        })
      }
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
  }
};
</script>
<style scoped>
.el-main{
	margin: 70px auto;
}

</style>
