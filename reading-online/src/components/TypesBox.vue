<template>
	<div class="types-box">
		<el-row>
			<el-col :span="16" :offset="4">
				<div class="grid-content">
					<div v-for="(channels,index) in channelList.length" :key="index">
						<h3>{{channelList[channels-1].channel_name}}频道</h3>
						<!-- 类型连接 -->
						<div class="categry-link">
							<el-link :underline="false" type="info"
							v-for="(link,index) in categoryList[channels-1]"
							:key="index" 
							@click="categorySelect(link.channel, link.category_name)"> {{link.category_name}} | </el-link>
							<el-link :underline="false" type="info" href="/HRead/分类"> 更多></el-link>
						</div>
						<!-- /类型连接 -->
						<!-- 频道 的推荐书籍列表 -->
						<el-row type="flex" class="row-bg" justify="center" :gutter="20">
							<el-col :span="4" v-for="book in bookList[channels-1]" :key="book.book_id">
								<div class="grid-content">
									<el-link :underline="false"
									@click="bookSelect(book.book_id)">
										<div :style="{ backgroundImage: `url( ${book.images} )`}"
										style="height:150px;width:120px">
										</div>
									</el-link>
									<p>{{book.author}}</p>
									<el-link :underline="false"
									@click="bookSelect(book.book_id)">
										{{book.book_name}}
									</el-link>
								</div>
							</el-col>
						</el-row>
						<!-- /频道 的推荐书籍列表 -->
					</div>
				</div>
			</el-col>
		</el-row>
	</div> 
</template>

<script>
	export default {
		name:"TypesBox",
		data() {
			return {
				bookList: [],
				categoryList:[],
				channelList: [],
			};
		},
		computed: {
			channelListobj: {
				get: function(){
					return this.channelList; // 在这里把临时对象的值通过计算属性赋值给页面中用到的对象
				}
			},
		},
		created() {
			var that = this
			// 请求数据接口
			that.common.getChannel(that._self)
			that.common.getCategory(that._self)
			that.common.getBookList(that._self)
		},
		watch: {
			// 动态监听 数据 刷新页面内容
			bookList: {
				handler:function (to) {
					this.bookList =  to
					},
					deep:true
			},
			categoryList: {
				handler: function(to) {
					this.categoryList = to
				},
				deep: true
			}
		},
		methods: {
			// 点击分类link 向分类页路由传参 便于相应请求书籍列表数据
			categorySelect: function(channel_name, category_name) {
				this.$router.push({
					path: '/HRead/分类',
					query: {
						channel: channel_name,
						category: category_name
					}
				})
			},
			/* 点击单本书籍 进入详情页 */
			bookSelect: function(id){
				console.log(id)
				this.$router.push({
					path: '/详情',
					query: {
						book_id: id
					}
				})
			}

			
		}
	}
</script>

<style scoped>
	/*  */
	.types-box{
		margin-top: 10px;
		background-color: rgba(31,45,61,.11);
	}
	/* 取消el-main的滚动条 */
	.el-main{
		overflow: hidden;
	}
	/* 删除 */
	/* 书籍上下间隔 */
	.el-row {
		margin-bottom: 20px;
	}
	/* .bg-purple-dark {
		background: #99a9bf;
	}
	.bg-purple {
		background: #d3dce6;
	} */
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	/* 分类标题位置调整 */
	.types_box>h3{
		padding: 15px;
		line-height: 90px;
	}
	h3{
		height: 40px;
		line-height: 40px;
		margin: 0;
	}
	.categry-link{
		height: 30px;
		/* box-sizing: border-box; */
		line-height: 30px;
		margin-top: -10px;
	}
	.el-link.el-link--info{
		/* margin-top: -50px; */
		height: 30px;
	}
	.el-link.el-link--default{
		color: #000000;
		font-size: Medium;
		margin-top: 8px;
	}
	/* 每一个大小 */
	.grid-content{
		padding: 20px 0px 10px 0px;
	}
	.grid-content p{
		margin: 0.5em;
	}
</style>