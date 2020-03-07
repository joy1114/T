import Vue from 'vue'
import Router from 'vue-router'
import HRead from '@/views/HRead'

Vue.use(Router)

var router = new Router({
	mode:'history',
	base: process.env.BASE_URL, // 取消地址栏显示 hash #
	routes: [
		{
			path: '/HRead',
			name: 'HRead',
			component: HRead,/* 主要导航栏 */
			children:[
				{
					path: '',
					name: 'Home',
					component: () => import("@/views/Home"),/* 首页内容 */
				},
				{
					path: 'kingBand',
					name: 'kingBand',
					component: () => import("@/views/kingBand"),/* 排行榜目录结构 */
					children:[
						{
							path: ':id',
							name: 'Billboard',
							component: () => import("@/views/Billboard"),/* 排行榜具体榜单书籍列表 */
						},
					]
				},
				{
					path: '我的书架',
					name: 'Personal',
					component: () => import("@/views/Personal"),/* 个人中心页 */
					meta: {
						// 自定义规则
						auth: true // 设置为true的路由是需要权限的
					}
				},
				{
					path: '分类',
					name: 'BookTypes',
					component: () => import("@/views/BookTypes"),/* 分类页 */
				},
			]
		},
		{
			path: '/详情',
			name: 'BookIntroduce',
			component: () => import("@/views/Book.vue"),/* 书籍详情页 */
		},
		
		{
			path: '/reading',
			name: 'Reading',
			component: () => import("@/views/Reading"),/* 阅读页面 */
			// children: [
			// 	{
			// 		path: 'collection',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
			// 		name: 'Collection',
			// 		component: readingWords
			// 	},
			// 	{
			// 		path: 'trace',
			// 		name: 'Trace',
			// 		component: Trace
			// 	}
			// ]
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import("@/views/Login"),/* 登录页面 */
		},
		{
			path: '/register',
			name: 'Register',
			component: () => import("@/views/Register"),/* 注册页面 */
		},
		// {
		// 	path: '*',
		// 	redirect: '/404'
		// },
		{
			path: '*',
			redirect: '/HRead' // 其他未定义的路由重定向到 home 页
		}
		
  ],
})

  // 前端路由拦截
  
router.beforeEach(function (to, from, next) {
	// 获取 token
	let token = sessionStorage.getItem('token')

	// 判断即将访问的路由是否需要权限
    if (to.meta.auth) {
		if (token) {
			next()
		} else {
			next({
			path: '/login',
			query: {
				redirect: to.fullPath // 将要跳转的路由作为参数，登陆成功后直接跳转到该路由
			}
		})
		}
	} else {
		next()
	}
})

export default router
