<template>
	<div id="change-info">
		<el-container>
			<el-header>
			</el-header>
			<el-main>
				<el-row type="flex" justify="center">
					<el-col :span="10" style="background-color: #ffffa2">
						<div class="grid-content">
							<el-form :model="form" label-position="right" status-icon :rules="rules" ref="form">
								<el-form-item label="头像" :label-width="formLabelWidth">
									<el-row type="flex" justify="space-around" style="align-items: center;">
										<el-col :span="5">
											<div class="grid-content">
												<img :src="form.user_photo" class="avatar form-avatar">
											</div>
										</el-col>
										<el-col :span="5">
											<div class="grid-content">
												<el-upload
												class="avatar-uploader"
												action='string'
												accept="image/jpg,image/jpeg"
												:show-file-list="false"
												:http-request="uploadImg"
												>
													<i class="el-icon-edit form-avatar-uploader-icon">更改头像></i>
												</el-upload>
											</div>
										</el-col>
									</el-row>
								</el-form-item>
								<el-form-item label="昵称" :label-width="formLabelWidth" prop="user_name">
									<div class="input-position">
									<el-input
									type="text"
									maxlength="10"
									show-word-limit
									v-model="form.user_name" autocomplete="off">
									</el-input>
									</div>
								</el-form-item>
								<el-form-item label="出生年月" :label-width="formLabelWidth">
									<div class="input-position">
									<el-date-picker
									v-model="form.user_born"
									type="date"
									value-format="yyyy-MM-dd"
									placeholder="选择日期">
									</el-date-picker>
									</div>
								</el-form-item>
								<el-form-item label="性别" :label-width="formLabelWidth">
									<div class="input-position">
									<el-radio v-model="form.user_sex" label="男">男</el-radio>
									<el-radio v-model="form.user_sex" label="女">女</el-radio>
									</div>
								</el-form-item>
								<el-form-item label="个性签名" :label-width="formLabelWidth">
									<div class="input-position">
									<el-input
									type="text"
									placeholder="请输入内容"
									v-model="form.user_tips"
									maxlength="30"
									show-word-limit
									>
									</el-input>
									</div>
								</el-form-item>
								<el-form-item>
									<div class="button">
										<el-button type="primary" @click="submitForm('form')">提交</el-button>
										<el-button @click="resetForm('form')">重置</el-button>
									</div>
									
								</el-form-item>
								
							</el-form>
						</div>
					</el-col>
				</el-row>
				
			</el-main>
		</el-container>

	</div>
</template>

<script>
export default {
	name: 'changeInfo',
	components: {
		// HelloWorld
	},
	data(){
		var reg_name = /^([a-zA-Z]|[\u4e00-\u9fa5]){1}([a-zA-Z0-9]|[\u4E00-\u9FA5]|[-]){0,14}$/ 
		var validateName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('昵称不能为空！'));
			}else if ( !reg_name.test(value) ){
				callback(new Error('昵称必须由6-10位数字和字母组成！'));
			}else {
				callback();
			}
		}
		return{
			form: {},
			formLabelWidth: '120px',
			rules: {
				user_name: [
					{ required: true,validator: validateName, trigger: 'blur' }
				],
			}
		}
	},
	created(){
		var that = this
		that.form = JSON.parse(JSON.stringify(that.$store.getters.User))
	},
	methods: {
		submitForm(formName) {
			var that = this
			that.$refs[formName].validate((valid) => {
			if (valid) {
				console.log(that.$store.state.user.user_tips)
				that.$http.post('/user/change',{
					form: that.$refs[formName].model
				}).then(res =>{
					if(res.data.state === 0){
						this.$store.dispatch('Register',that.form)
					}
					that.$message({
						message: res.data.msg,
						type: res.data.type
					})
				}).catch(err =>{
					console.log(err)
				})
			} else {
				that.$message({
					message: '请检查格式是否正确！',
					type: 'error'
				})
				return false;
			}
        })
		},
		uploadImg(param){
			var that = this
			/* formData 文件格式上传 */
			let file = param.file
			let formData = new FormData()
			formData.append('chunk',file)
			formData.append('filename',that.formatFilename(file.name).filename)
			// formData.append('userid',that.form.user_id)

			//通过POST方式发送FormData格式的参数 的写法  
			that.$http({
			url: '/upload/img',//请求路径（接口）
			method: 'POST',//请求方式
			headers: { 'content-type': 'application/x-www-form-urlencoded' },// 请求头，发送FormData格式的数据，必须是 这种请求头
			data: formData,//发送请求要传的FormData参数
			}).then(res =>{
				if(res.data.state === 0){
					that.form.user_photo = res.data.url
				}
			}).catch(err =>{
				console.log(err)
			})
		},
		formatFilename: function(filename){
				console.log(filename)
				let dotIndex = filename.lastIndexOf('.')
				let name = filename.substring(0,dotIndex)
				let suffix = filename.substring(dotIndex+1)
				let date = new Date()
				/* md5加密 */
				name = this.$md5(name) + date.getTime()
				console.log(name)
				return {
					hash: name,
					// name: name,
					suffix,
					filename: `${name}.${suffix}`
				}
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
    },
}
</script>

<style scoped>
.avatar{
	width: 168px;
	height: 168px;
	line-height: 168px;
	border: 1px dashed orangered;
	border-radius: 90px;
	text-align: center;
	font-size: 28px;
	color: #8c939d;
	background-size: contain;/* 背景铺满div且图片完整 */
}
.el-form{
	margin: 20px auto;
}
.input-position{
	text-align: left;
}
.el-input{
	width: 90%;
}
.button{
	text-align: center;
}
</style>
