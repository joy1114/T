<template>
	<div id="carousel-box">
		<el-carousel :interval="4000" type="card" height="340px">
			<el-carousel-item
			v-for="item in cBooks" :key="item.book_id">
				
				<a @click="imagesClick(item.book_id)">
					<h3 class="medium">{{ item.book_name }}</h3>
					<div class="cbox-image"
					:style="{ backgroundImage: `url( ${item.images} )`}"
					ref="slide_img"></div>
					<div class="cbox-words" ref="slide_img">
						<p>{{item.book_intro}}</p>
					</div>
				</a>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default {
		name:'Carousel',
		data() {
			return {
				activeIndex: '1',
				cBooks:[],
			};
	},
	created() {
		var that = this
		// 轮播 信息获取
		that.$http.get('/book/suggest').then( function(res){
			that.cBooks = res.data.data.splice(0,6)
		}).catch( function (err){
			console.log(err)
		})
	},
	methods: {
		// 点击轮播图片 跳转相关详情页
		imagesClick: function(id){
			var that = this
			console.log(id)
			that.$router.push({
				path:'/详情',
				query:{
					book_id: id
				}
			})
		}
	}
	}
</script>

<style scoped>
a{
	color: black;
	text-decoration: none;
}
h3{
	margin: 0 auto;
	padding: 10px;
}
#carousel-box{
	margin-bottom: 20px;
}
.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
	background-color: #d3dce6;
}
/* 书籍图片背景大小 位置调整 */
.cbox-image{
	height: 234px;
	width: 175.5px;
	background-size: contain;/* 背景铺满div且图片完整 */
	margin-left: 20px;
	float: left;
}
.cbox-words{
	height: 234px;
	margin-left: 200px;
	text-align: left;
	padding: 20px 20px;
	word-break:break-all;
}
</style>
