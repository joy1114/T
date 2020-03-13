<template>
  <div class="hread">
		<el-container>
			<el-header>
				<Navbar></Navbar>
			</el-header>
			<el-main class="mainContainer">
				<!-- 回到顶部 el-backtop 需要放在外层div第一行 不能放在尾部 没有效果 -->
				<!-- <el-backtop target=".mainContainer"></el-backtop> -->
				
				<router-view/>
				<template>
					<el-backtop></el-backtop>
				</template>
			</el-main>
			<el-footer>
				<FooterInfo></FooterInfo>
			</el-footer>
		</el-container>
	</div>
</template>

<script>
	import Navbar from '@/components/Nav.vue'
	import FooterInfo from "@/components/FooterInfo.vue"
export default {
	name: 'HRead',
	components: {
		Navbar,
		FooterInfo,
	}
}
</script>

<style scoped>
/* header与mian内容之间的空隙 */
	.el-main {
	margin-top: 10px;
	}
</style>
