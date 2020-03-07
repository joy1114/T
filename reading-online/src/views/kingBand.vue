<template>
	<div class="board">
		<el-container>
			<el-aside>
				<el-menu class="el-menu-vertical-demo board-nav"
				:default-active="activeIndex"
				router
				background-color="#ffdda9"
				text-color="#000000"
				active-text-color="#ffffff">
					<h1>
						<i class="el-icon-location"></i>
						<span>出版图书</span>
					</h1>
					<el-menu-item index="/HRead/kingBand/publishCollect">收藏榜</el-menu-item>
					<el-menu-item index="/HRead/kingBand/publishNewbook">新书榜</el-menu-item>
					<el-menu-item index="/HRead/kingBand/publishFavourable">好评榜</el-menu-item>
					<h1>
						<i class="el-icon-location"></i>
						<span>男生频道</span>
					</h1>
					
					<el-menu-item index="/HRead/kingBand/boyFavourable">好评榜</el-menu-item>
					<el-menu-item index="/HRead/kingBand/boyComplate">完结榜</el-menu-item>
					<el-menu-item index="/HRead/kingBand/boyContinued">连载榜</el-menu-item>
					<h1>
						<i class="el-icon-location"></i>
						<span>女生频道</span>
					</h1>					
					<el-menu-item index="/HRead/kingBand/girlFavourable">好评榜</el-menu-item>
					<el-menu-item index="/HRead/kingBand/girlComplate">完结榜</el-menu-item>					
					<el-menu-item index="/HRead/kingBand/girlContinued">
						<i class="el-icon-star-on"></i>
						<span>连载榜</span>
					</el-menu-item>					
				</el-menu>
			</el-aside>
			<el-container>
				<router-view/>
			</el-container>
		</el-container>
  </div>
</template>
<script>
	export default {
		name: 'kingBand',
		components: {
		},
		data() {
			return {
				activeIndex: '',
				
			}
		},
		created(){
			// 刷新页面或页面初始加载时，默认选中出版第一个榜单
			this.activeIndex = '/HRead/kingBand/publishCollect'
		},
		methods:{

		},
	}
</script>

<style scoped>
/* .board-nav{
	position: fixed;
} */
	
</style>