<template>
	<div id="nav">
		<el-row>
			<el-col :span="6">
				<div class="grid-content">
					XiangDuBOOK享读书城
				</div>
			</el-col>
			<el-col :span="6">
				<div class="grid-content">
					<el-menu :default-active="activeIndex"
					class="el-menu-demo" background-color="#ffffff"
					mode="horizontal"
					:router="true">
						<el-menu-item index="/HRead">首页</el-menu-item>
						<el-menu-item index="/HRead/kingBand/publishCollect">榜单</el-menu-item>
						<el-menu-item index="/HRead/分类">分类</el-menu-item>
						<el-menu-item index="/HRead/我的书架">我的书架</el-menu-item>
					</el-menu>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="grid-content">
					<el-input
						placeholder="请输入内容"
						prefix-icon="el-icon-search"
						v-model="input" clearable></el-input>
				</div>
			</el-col>
			<el-col :span="1">
				<div class="grid-content">
					<el-button icon="el-icon-search" circle></el-button>
				</div>
			</el-col>
			<!-- 登录注册按钮 -->
			<el-col :span="6" v-if="!Token">
				<div class="grid-content">
					<el-button round>
						<router-link to="/login">登 录</router-link>
					</el-button>
					<el-button round>
						<router-link to="/register">注 册</router-link>
					</el-button>
				</div>
			</el-col>
			<!-- /登录注册按钮 -->
			<!-- 已登录用户操作栏 -->
			<el-col :span="6" v-if="Token">
				<div class="grid-content">
					<el-menu default-active="" mode="horizontal"
					class="el-menu-horizontal-demo" background-color="#ffffff"
					@select="userSelect">
						<el-menu-item index="/personnal">
							<i class="el-icon-user"></i>
							{{User}}
						</el-menu-item>
						<el-submenu index="2">
							<template slot="title">
								<el-badge is-dot>
									<i class="el-icon-message"></i>
								</el-badge>
							</template>
							<el-menu-item index="/commit">评论</el-menu-item>
							<el-menu-item index="/good">赞</el-menu-item>
							<el-menu-item index="/message-setting">消息设置</el-menu-item>
						</el-submenu>
						<el-submenu index="3">
							<template slot="title">
								<i class="el-icon-setting"></i>
							</template>
							<el-menu-item index="/account-setting">帐号设置</el-menu-item>
							<el-menu-item index="/message-setting">消息设置</el-menu-item>
							<el-menu-item @click.native="loginOut">退出登录</el-menu-item>
						</el-submenu>
					</el-menu>
				</div>
			</el-col>
			<!-- /已登录用户操作栏 -->
		</el-row>
	</div>
</template>

<script>
	export default {
    data() {
      return {
		input: '',
		activeIndex:'/HRead',
		pathName: '',
      };
    },
	created(){
		// 初始化导航默认高亮选项  
		// 防止页面刷新后榜单页面path改变带来activeIndex失效 
		this.pathName = this.$route.name
		console.log('pathName:'+this.pathName)
		// 调用匹配激活选项函数
		this.getActive(this.pathName)
	},
	computed:{
		Token: function(){
			return this.$store.state.token
		},
		User: function(){
			return this.$store.state.user.user_name
		}
	},
	watch:{
		// 监听路由变化，使导航根据页面正确高亮 选项
		$route(to){
			this.pathName = to.name
			// 调用匹配激活选项函数
			this.getActive(this.pathName)
			console.log('this.activeIndex'+this.activeIndex)
		}
	},
    methods: {
		// 
		userSelect: function(key,keypath){
			console.log(key+',',keypath)
		},
		// 根据路由名字匹配激活选项
		getActive: function (pathName) {
			switch (pathName) {
				case 'Home':
					this.activeIndex = "/HRead"
					break;
				case 'Billboard':
				case 'kingBand':
					this.activeIndex = "/HRead/kingBand/publishCollect"
					break;
				case 'BookTypes':
					this.activeIndex = "/HRead/分类"
					break;
				case 'Personal':
					this.activeIndex = "/HRead/我的书架"
					break;
				default:
					this.activeIndex = ""
					break;
			}
		},
		/* 退出登录 */
		loginOut: function () {
			this.$store.dispatch('LoginOut')
			/* 若当前的路由是需要权限的路由 重定向到首页 */
			if(this.$route.path == '/personal'){
				this.$router.push({
                    path: this.$route.query.redirect || "/home"
                  })
			}
		},
    }
  }
	
</script>

<style scoped>
	a{
		text-decoration: none;
		color: gray
	}
	#nav{
		width: 100%;
		position: fixed;
		z-index: 10;
		height: 68px;
	}
	.el-row {
		margin-bottom: 20px;
	}
	[class*=el-col-] {
		line-height: 60px;
	}
	.el-menu.el-menu--horizontal{
		border: 0;
	}
	/* 去除用户相关menu的指示箭头 */
	.el-icon-arrow-down:before {
		content: none!important;
	}
	/* 消息标记 定位 */
	.el-badge__content.is-fixed.is-dot {
		right: 13px!important;
	}
	.el-badge__content.is-fixed {
		top: 24px!important;
	}
	/* 激活菜单项 border样式取消 */
	.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
		border: none!important;
	}
</style>
