<template>
	<div id="read-interface">
		<el-row style="height: 1000px">
			<el-col :span="6">
				<div class="grid-content bg-purple-dark" style="height: 1377px">
					<el-menu
					default-active="2"
					class="el-menu-vertical-demo"
					@open="handleOpen"
					@close="handleClose"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b">
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-folder-opened"></i>
								<span>目录</span>
							</template>
							<el-menu-item-group class="directories" v-for="(item, index) in directories" :key="index">
								<el-menu-item :index="index">
									<router-link :to="{}">
									{{index}}:{{directories[index]}}
									</router-link>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</el-menu>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content bg-purple" style="height: 1377px">
					<router-view></router-view>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content bg-purple-dark" style="height: 1377px">右边</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name:"Reading",
		components: {
			
		},
		data() {
			return {
				directories:{
					"第一章":"标题1",
					"第二章":"标题2",
					"第三章":"标题3",
					"第四章":"标题4",
					"第五章":"标题5",
					"第六章":"标题6",
					"第七章":"标题7",
				},
			};
		},
		methods: {
			clickMouse(){
				
			}
		}
	}
</script>

<style scoped>
	.bg-purple-dark {
		background: #99a9bf;
  }
	.bg-purple {
		background: #d3dce6;
  }
	.directories{
		text-align: left;
  }
</style>
