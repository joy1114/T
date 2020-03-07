<template>
	<el-container>
		<el-header>
			<el-row>
				<el-col :span="2" :offset="4">
					<div class="grid-content">
						<el-image :src="user.user_photo">
							<div slot="placeholder" class="image-slot">
							加载中<span class="dot">...</span>
							</div>
						</el-image>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content">
						<h1>{{user.user_name}}的书架</h1>
						<p>{{user.user_tips}}</p>
					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-container>
			<el-aside width=300px>
				<div v-for="(item,index) in 8" :key="index">
					<h1>右边{{item}}{{index}}</h1>
				</div>
			</el-aside>
			<el-main>
				<el-row>
					<el-col :span="16">
						<div class="grid-content">
							<h1>我的书架</h1>
							<el-col :span="4" v-for="item in bookList" :key="item.book_name">
								<div :style="{ backgroundImage: `url( ${item.images} )`}"
								style="height: 100px;width:80px;"
								></div>
								<p>{{item.author}}</p>
								<h3>{{item.book_name}}</h3>
							</el-col>
						</div>
					</el-col>
					<el-col :span="4">
						<div class="grid-content">
							<h1>this is personal</h1>
						</div>
					</el-col>
				</el-row>
			</el-main>
		</el-container>		
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
			}
		},
		created(){
			/* 请求用户信息 */
			this.$http.get('/user/personal?user_id='+this.$store.getters.userId)
			.then((res)=>{
				console.log(res.data.data)
				this.user = res.data.data
				console.log(this.user.user_id)
			}).catch(function(err){
				console.log(err)
			})

			/* 收藏的booklist */
			let book_ids = this.$store.state.getters.userCollectArray
			this.$http.get('/book/collect?book_ids='+book_ids)
			.then( (res)=>{
				this.bookList = res.data.data
			}).catch(function(err){
				console.log(err)
			})
			
		}
	}
</script>

<style>
</style>
