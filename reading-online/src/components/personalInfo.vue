<template>
  <div id="personal-info">
		<el-container>
			<el-header>
				<Navbar></Navbar>
			</el-header>
			<el-main>
				<router-view/>
			</el-main>
			<el-footer>
				<FooterInfo></FooterInfo>
			</el-footer>
		</el-container>
	
		
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
	</div>
</template>

<script>
export default {
	name: 'personalInfo',
	components: {
		// HelloWorld
	}
}
</script>

<style scoped>
/* header与mian内容之间的空隙 */
	.el-main {
	margin-top: 10px;
	/* line-height: 0px; */ /* 卡片切换点的位置 */
	overflow: hidden;
	}
</style>
