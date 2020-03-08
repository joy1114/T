<template>
	<el-container>
		<!-- 用户信息 头部 -->
		<el-header class="user-info">
			<el-row>
				<!-- 头像 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
						<!-- <el-image :src="user.user_photo">
							<div slot="placeholder" class="image-slot">
							加载中<span class="dot">...</span>
							</div>
						</el-image> -->
						<!-- 可上传头像 -->
						<el-upload
						class="avatar-uploader"
						action="https://jsonplaceholder.typicode.com/posts/"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
							<img v-if="user.user_photo" :src="user.user_photo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<!-- /可上传头像 -->
					</div>
				</el-col>
				<!-- /头像 -->
				<!-- 用户名及信息 -->
				<el-col :span="12">
					<div class="grid-content">
						<el-row type="flex" justify="space-between" style="align-items: center;">
							<el-col :span="12">
								<div class="grid-content">
									<h1 style="text-align: left;">{{user.user_name}}</h1>
								</div>
							</el-col>
							<el-col :span="4">
								<div class="grid-content">
									<el-button type="primary" icon="el-icon-edit">编辑资料</el-button>
								</div>
							</el-col>
						</el-row>
						<!-- <el-row>
							<el-col :span="12">
								<div class="grid-content">
									<p>{{user.user_tips}}</p>
								</div>
							</el-col>
						</el-row> -->
						<el-row>
							<el-col :span="12">
								<div class="grid-content">
									<p>{{user.user_tips}}</p>
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
			<el-aside width=300px>
				<el-menu>
					
				</el-menu>
			</el-aside>
			<!-- /功能导航栏 -->
			<!-- 功能模块内容 -->
			<el-main>
				<!-- 收藏的书籍列表 -->
				<el-row>
					<el-col :span="16">
						<div class="grid-content">
							<h1>我的书架</h1>
							<h2 v-show="noCollect">您收藏的书籍将在这里展示！</h2>
							<div v-if="bookList">
								<el-col :span="6" v-for="item in bookList" :key="item.book_name">
									<div :style="{ backgroundImage: `url( ${item.images} )`}"
									style="height: 200px;width:150px;"></div>
									<p>{{item.author}}</p>
									<h3>{{item.book_name}}</h3>
								</el-col>
							</div>
						</div>
					</el-col>
					<el-col :span="4">
						<div class="grid-content">
							<h1>this is personal</h1>
						</div>
					</el-col>
				</el-row>
				<!-- /收藏的书籍列表 -->
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
			// HelloWorld
		},
		data() {
			return {
				user: {},
				bookList: [],
				commits:[],
				noCollect: false,
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
					console.log(res.data.data)
					this.bookList = res.data.data
				}).catch(function(err){
					console.log(err)
				})
			}else{
				this.noCollect = true
			}
			
			
		},
		methods: {
			/* 上传成功将图片渲染页面 */
			handleAvatarSuccess(res, file) {
				this.user.user_photo = URL.createObjectURL(file.raw);
				/* 请求服务器更新用户头像数据 */
				this.$http.post('user/photo',{
					url: URL.createObjectURL(file.raw),
					user_id: this.user.user_id
				}).then( res =>{
					/* 更新成功 改变data 渲染到页面 */
					this.user.user_photo = URL.createObjectURL(file.raw);
					/* 修改vuex用户状态 */
					this.$store.dispatch('uploadPhoto',URL.createObjectURL(file.raw))
					alert(res.data.msg)
				}).catch( function(err){
					console.log(err)
				})
			},
			/* 上传头像限制图像大小 */
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			}
		}
	}
</script>

<style scoped>
.user-info{
	height: 200px!important;
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
</style>
