<template>
	<div id="book-introduce">
		<el-container>
			<el-header>
				<Nav></Nav>
			</el-header>
			<el-main>
				<!-- 图书信息 -->
				<el-row :gutter="10" type="flex" class="row-bg" justify="center">
					<el-col :span="6" class="intro-images">
						<div class="grid-content"
						:style="{ backgroundImage: `url( ${book.images} )`}"></div>
					</el-col>
					<el-col :span="10">
						<div class="grid-content">
							<el-container>
								<el-header class="introduce bg-purple-light">
									<h3>{{book.book_name}}</h3>
									<p>作者:{{book.author}}</p>
								</el-header>
								<el-main class="intro-words">
									<p>{{book.book_intro}}</p>
								</el-main>
								<el-footer class="bg-purple-light">
									<el-rate
									v-model="value"
									disabled
									show-score
									text-color="#ff9900"
									score-template="{value}">
									</el-rate>
									<el-button type="primary" round
									@click="readingClick(book.book_id)">阅读</el-button>
									<el-button type="primary" round
									@click="collectClick(book.book_id)">收藏</el-button>
									<!-- <el-button type="primary" round>购买</el-button> -->
								</el-footer>
							</el-container>
						</div>
					</el-col>
				</el-row>
				<!-- /图书信息 -->
				<!-- 评论区 -->
				<el-row type="flex" justify="center" class="commit">
					<el-col :span="16">
						<div class="grid-content">
							<!-- <TypesBox></TypesBox> -->
							<CommitBox></CommitBox>
						</div>
					</el-col>
				</el-row>
				<!-- /评论区 -->
			</el-main>
			<el-footer>
				<FooterInfo></FooterInfo>
			</el-footer>
		</el-container>
		
	</div>
</template>

<script>
	import Nav from "../components/Nav.vue";
	// import TypesBox from "../components/TypesBox.vue";
	import FooterInfo from "../components/FooterInfo.vue";
	import CommitBox from "../components/CommitBox.vue"
	export default {
		name: "BookIntroduce",
		components: {
			Nav,
			// TypesBox,
			FooterInfo,
			CommitBox,
		},
		data() {
			return {
				bookList:[],
				book:{},
				value: 4.5
			};
		},
		computed: {
			// User(){
			// 	var arr = this.$store.getters.userCollectArray
			// 	if(arr){
			// 		arr = arr.filter(item => item === this.$route.query.book_id)
			// 	}
			// 	return arr
			// }
		},
		created() {
			var that = this
			that.$http.get('/book/one?book_id='+that.$route.query.book_id)
			.then( function(res){
				that.book = res.data.data
			}).catch( function(err){
				console.log(err)
			})
		},
		methods: {
			// 阅读按钮点击事件 跳转到阅读界面 传递相应书籍id
			readingClick: function(id){
				var that = this
				console.log(id)
				that.$router.push({
					path: '/阅读',
					query:{
						book_id: id
					}
				})
			},
			// 收藏事件
			collectClick: function(id){
				var that = this
				// console.log(id)
				// id = id.toString()
				// console.log(that.$store.state.user.user_id)
				/* 判断是否是登录状态 */
				if (sessionStorage.getItem('token')) {
					/* 判断该用户收藏过没有 */
					console.log(that.$store.getters.User.user_id)
					console.log(that.$store.getters.userCollectArray.length)
					var arr = that.$store.getters.userCollectArray
					arr = arr.length? arr.filter((item)=>item === id) : []
					console.log(arr)
					if(!arr.length){
						that.$http.post('/user/collect',{
						book_id: id.toString(),
						user_id: that.$store.getters.User.user_id
						}).then(function(res){
							that.$store.dispatch('newCollect',id.toString())
							alert(res.data.msg)
						}).catch(function(err){
							console.log(err)
						})
					}else{
						alert('已经收藏过了！')
					}
				}else{
					alert('请先登录！')
				}
			}
		}
	};
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		margin-top: 0px;
	}
	/* 取消el-main的滚动条 */
	.el-main{
		overflow: hidden;
	}
	.intro-images{
		padding: 50px;
		background-color: #E5E9F2;
	}
	.intro-images div{
		height: 208px;
		width: 156px;
		margin: auto auto;
	}
	.intro-words {
		margin: 10px;
		text-align: left;
		overflow: hidden;
	}
	.introduce{
		text-align: left;
		padding: 5px;
	}
	.el-footer{
		text-align: center;
		line-height: 60px;
	}
	.bg-purple-light {
		background: #e5e9f2;
	}
  /* 评论区 */
	.commit{
		padding: 20px;
	}
</style>
