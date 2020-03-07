<template>
	<el-row>
		<el-col :span="16" :offset="4">
			<div class="grid-content">
				<el-row>
					<!-- 相应分类清单 -->
					<el-col :span="4" v-for="( item, index ) in bookList" :key="index">
						<div class="grid-content">
							<div :style="{ backgroundImage: `url( ${item.images} )`}"
							style="height:150px;width:120px"></div>
							<p>{{item.author}}</p>
							<h1>{{item.bookname}}</h1>
						</div>
					</el-col>
				</el-row>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	// import HelloWorld from '@/components/HelloWorld.vue'
export default {
	name: 'TypeContent',
	data(){
		return{
			bookList: [],
			selectItem: this.msg
		}
	},
	// 父组件传递的参数值 ：当前选中的查询组合
	props: {
		msg: Object,
	},
	created(){
		// 初始化数据
		var that = this
		// 请求数据
		that.getBook()
		
	},
	mounted(){
		// 页面元素生成完毕调用 操作部分Dom 相关数据
		
	},
	watch: {
		// 动态监听 父组件传来的参数 因点击事件发生改变 动态更新这些参数
		msg: {
            handler:function (to) {
				this.selectItem.channel = to.channel
				this.selectItem.category = to.category
				this.selectItem.status = to.status
				// 调用请求数据函数 重新渲染页面内容
				this.getBook()
                // console.log('子组件to:'+to.channel+'selectItem:'+this.selectItem.category)
                },
                deep:true
            },
		// 冒号前边这个就是从父组件传过来的，后边的就是变化了的监听函数
		
	},
	methods: {
		/* 分类请求接口 */
		getBook: function() {
			var that = this
			that.$http.post("/book/categoryQurry", {
				channel: that.selectItem.channel,
				category: that.selectItem.category,
				book_status: that.selectItem.status
			}).then(function (res) {
				// console.log('返回')
					//获取book数据
				that.bookList = res.data.data
			}).catch(function (err) {
				console.log(err)
			})
		}

	}

}
</script>

<style scoped>

</style>