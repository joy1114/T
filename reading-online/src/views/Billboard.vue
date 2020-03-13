<template>
	<el-container>
		<el-header>
			<el-row>
				<el-col :span="8">
					<div class="grid-content">
						<img src="" alt="榜单">
					</div>
				</el-col>
				<el-col :span="16">
					<div class="grid-content">
						<p>{{billboard}}</p>
					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<el-row class="board-row" v-for="item in bookList" :key="item.book_id" style="margin-top: 10px">
				<!-- 排行位次图标 -->
				<el-col :span="3" :offset="4">
					<div class="grid-content">
						<div style="height:60px;width:60px;">
							<i class="el-icon-star-on"></i>
						</div>
					</div>
				</el-col>
				<!-- 图书信息 -->
				<el-col :span="4">
					<div class="grid-content">
						<div :style="{ backgroundImage: `url( ${item.images} )`}"
						style="height: 100px;width:80px;"
						></div>
						<p>{{item.author}}</p>
						<p>{{item.collect_number}}</p>
						<h3>{{item.book_name}}</h3>
					</div>
				</el-col>
				<el-col :span="9">
					<div class="grid-content">
						<p>{{item.book_intro}}</p>
					</div>
				</el-col>
			</el-row>
			<h1>This is {{billboard}}Billboard page</h1>				
		</el-main>
	</el-container>
</template>

<script>
	// import HelloWorld from '@/components/HelloWorld.vue'
export default {
	name: 'Billboard',
	data(){
		return{
			billboard: '',
			bookList: [],
			path: ''
		}
	},
	created(){
		// 初始化数据
		
		var that = this
		that.billboard = "publishCollect"
		this.path = '/book/'+this.billboard
		this.getBook(this.path)
		
	},
	watch: {
		// 解决组件复用后生命周期钩子函数不会第二次调用问题 
		// 侧边导航栏点击事件带来的路由变化导致复用组件内容渲染不正确
		// 动态监听
		$route(to, from) {
			this.billboard = to.params.id,
			console.log("选择的前一个排行榜是："+from.params.id),
			this.billboard = this.$route.params.id,
			this.path = "/book/"+this.billboard
			this.getBook(this.path)
		},
	},
	methods: {

		getBook: function(reqPath) {
			var that = this
			console.log(reqPath)
			that.$http.get(reqPath)
			.then(function (res) {
				//获取book数据
				console.log(res.data)
				that.bookList = res.data.data
				console.log(that.bookList)
			}).catch(function (err) {
                console.log(err)
			})
		}
	}

}
</script>

<style scoped>
.el-header{
	margin: 0 auto;
	text-align: center
}
.board-content{
	height: 100%;
	width: 100%;
}
.board-row{
	border-bottom: 2px solid #00B7FF;
}
</style>