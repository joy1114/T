<template>
	<el-container>
		
		<!-- 用户信息 头部 -->
		<el-header class="user-info">
			<el-row>
				<!-- 头像 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
						<!-- 可上传头像 -->
						<el-upload
						class="avatar-uploader"
						action='string'
						accept="image/jpg,image/jpeg"
						:show-file-list="false"
						:http-request="uploadImg"
						>
							<img v-if="user.user_photo" :src="user.user_photo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<!-- /可上传头像 -->
					</div>
				</el-col>
				<!-- /头像 -->
				<!-- 用户名及信息 -->
				<el-col :span="12" class="user-name">
					<div class="grid-content">
						<el-row type="flex" justify="space-between" style="align-items: center;">
							<el-col :span="12">
								<div class="grid-content">
									<h2 style="text-align: left;">{{user.user_name}}</h2>
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content">
									<el-button type="primary" icon="el-icon-edit" :loading="waitLoad"
									@click="changeInfo"></el-button>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="16">
								<div class="grid-content">
									<p>{{user.user_tips}}</p>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="16">
								<div class="grid-content">
									<el-tag>标签一</el-tag>
									<el-tag type="success">标签二</el-tag>
									<el-tag type="info">标签三</el-tag>
									<el-tag type="warning">标签四</el-tag>
									<el-tag type="danger">标签五</el-tag>
								</div>
							</el-col>
						</el-row>
						
					</div>
				</el-col>
				<!-- /用户名及信息 -->
			</el-row>
		</el-header>
		<!-- /用户信息 头部 -->
		<!-- 相关功能板块 -->
		<el-container>
			<!-- 功能导航栏 -->
			<el-aside width=300px style="padding: 20px">
				<el-menu
				default-active="2"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				background-color="#ffffd0"
				text-color="#000000"
				active-text-color="#ff2292"
				style="padding: 10px">
					<el-submenu index="3">
						<template slot="title">
							<span class="title">我的阅读</span>
						</template>
						<el-menu-item index="3-1">最近阅读</el-menu-item>
						<el-menu-item index="3-2">我的收藏</el-menu-item>
						<el-menu-item index="3-3">我的书单</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title">
							<span class="title">我的评论</span>
						</template>
						<el-menu-item index="4-1">评论管理</el-menu-item>
						<el-menu-item index="4-2">消息设置</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- /功能导航栏 -->

			<!-- 功能模块内容 -->
			<el-main>
				<!-- 我的阅读 -->
				<div class="my-read">
					<div class="split"></div>
					<el-row>
						<el-col :span="20">
							<div class="grid-content">
								<h2 style="text-align: left;" >最近阅读</h2>
								<p v-show="noCollect">您最近七天阅读过的书籍将在这里展示！</p>
								<div class="book-list" v-if="bookList">
									<el-col :span="6" v-for="item in bookList" :key="item.book_name">
										<div :style="{ backgroundImage: `url( ${item.images} )`}"
										style="height: 200px;width:150px;"></div>
										<p>{{item.author}}</p>
										<h3>{{item.book_name}}</h3>
									</el-col>
								</div>
							</div>
						</el-col>
						<!-- <el-col :span="4">
							<div class="grid-content">
								<h1>this is personal</h1>
							</div>
						</el-col> -->
					</el-row>
					<!-- /我的阅读 -->
					<!-- 最近阅读书籍列表 -->
					<div class="split"></div>
					<el-row>
						<el-col :span="20">
							<div class="grid-content">
								<h2 style="text-align: left;" >我的收藏</h2>
								<p v-show="noCollect">您收藏的书籍将在这里展示！</p>
								<div class="book-list" v-if="bookList">
									<el-col :span="6" v-for="item in bookList" :key="item.book_name">
										<div :style="{ backgroundImage: `url( ${item.images} )`}"
										style="height: 200px;width:150px;"></div>
										<p>{{item.author}}</p>
										<h3>{{item.book_name}}</h3>
									</el-col>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="my-commit">
					<div class="split"></div>
						<el-row>
							<el-col :span="20">
								<div class="grid-content">
									<h2 style="text-align: left;" >我的评论</h2>
									<p v-show="noCollect">您评论内容将在这里展示！</p>
									<div class="book-list" v-if="commitList">
										<el-col :span="6" v-for="item in commitList" :key="item.book_name">
											<div :style="{ backgroundImage: `url( ${item.images} )`}"
											style="height: 200px;width:150px;"></div>
											<p>{{item.author}}</p>
											<h3>{{item.book_name}}</h3>
										</el-col>
									</div>
								</div>
							</el-col>
						</el-row>
				</div>
				<!-- <div class="">

				</div> -->
				
				<!-- /最近阅读书籍列表 -->
			</el-main>
			<!-- /功能模块内容 -->
		</el-container>
		<!-- /相关功能板块 -->	
	</el-container>
</template>

<script>

	export default {
		name: 'personal',
		components: {
		},
		data() {
			return {
				user: {},
				bookList: [],
				commitList:[],
				noCollect: false,
				waitLoad: false,
			}
		},
		created(){
			/* 请求用户信息 */
			this.$http.get('/user/personal?user_id='+this.$store.getters.User.user_id)
			.then((res)=>{
				this.user = res.data.data
			}).catch(function(err){
				console.log(err)
			})

			/* 收藏的booklist */
			let book_ids = this.$store.getters.userCollectArray
			console.log(book_ids)
			if(book_ids.length){
				this.$http.post('/book/shelf',{
					book_ids: book_ids
				})
				.then( (res)=>{
					// console.log(res.data.data)
					this.bookList = res.data.data
				}).catch(function(err){
					console.log(err)
				})
			}else{
				this.noCollect = true
			}			
		},
		methods: {
			// 自定义上传钩子
			uploadImg(param){
				var that = this
				/* formData 文件格式上传 */
				let file = param.file
				let formData = new FormData()
				formData.append('chunk',file)
				formData.append('filename',that.formatFilename(file.name).filename)
				formData.append('userid',that.user.user_id)

				//通过POST方式发送FormData格式的参数 的写法  
				that.$http({
				url: '/user/photo',//请求路径（接口）
				method: 'POST',//请求方式
				headers: { 'content-type': 'application/x-www-form-urlencoded' },// 请求头，发送FormData格式的数据，必须是 这种请求头
				data: formData,//发送请求要传的FormData参数
				}).then(res =>{
					if(res.data.state === 0){
						that.user.user_photo = res.data.url
						this.$store.dispatch('uploadPhoto',res.data.url)
					}
					alert(res.data.msg)
				}).catch(err =>{
					console.log(err)
				})
			},
			/* 上传之前 头像限制图像大小 */
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isLt2M
			}, 
			/* 图片转换为base64 格式上传*/
			// uploadImgToBase64 (file) {
			// 	return new Promise((resolve, reject) => {
			// 		const reader = new FileReader()
			// 		reader.readAsDataURL(file)
			// 		reader.onload = function () { // 图片转base64完成后返回reader对象
			// 			resolve(reader)
			// 		}
			// 		reader.onerror = reject
			// 	})
			// },
			// 使服务器文件名存储唯一
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
			changeInfo(){
				var that = this
				that.waitLoad = true

				console.log()
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	}
</script>

<style scoped>
.user-info{
	height: 200px!important;
}
.user-name .el-row{
	text-align: left;
}
/* 头像区域 */
	.avatar-uploader .el-upload {
		border: 1px dashed orangered;
		border-radius: 90px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		border: 1px dashed orangered;
		border-radius: 90px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		border: 2px solid orangered;
		border-radius: 90px;
		display: block;
	}
/* /头像区域 */
/* 分割线 */
.split{
	width: 100%;
	border: 2px solid orangered;
}
/* 列表样式 */
.book-list{
	background-color: beige;
}
/* 功能菜单样式 */
.el-submenu{
	text-align: left;
}
.title{
	font-size: 18px;
}
</style>
