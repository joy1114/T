<template>
  <div id="hread">
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
	import Navbar from '@/components/Nav.vue'
	import FooterInfo from "@/components/FooterInfo.vue";
export default {
	name: 'HRead',
	components: {
		Navbar,
		FooterInfo,
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
