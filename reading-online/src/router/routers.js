import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
/* vue-router 版本升级后 push和replace方法会返回一个promise, 可能在控制台看到未捕获的异常
解决：1.修改router 原型链 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

var router = new Router({
	mode:'history',
	base: process.env.BASE_URL, // 取消地址栏显示 hash #
	routes: [
		{
			path: '/首页',
			name: 'Home',
            component: Home,
		},
		{
			path: '/详情/:id',//动态路由 匹配 ：书籍id
			name: 'BookInfo',
			component: () => import("@/pages/bookInfo.vue"),/* 书籍详情页 */
		},
		
		{
			path: '/阅读/:id',
			name: 'Read',
			component: () => import("@/pages/read"),/* 阅读页面 */
			// 自定义路由权限
			// meta:{
			// 	'keep-alive': true
			// }
		},
		{
			path: '/书架/:name',
			name: 'Shelf',
			component: () => import('@/pages/shelf'),
			meta: {
				// 自定义规则
				auth: true // 设置为true的路由是需要登录权限的
			}
		},
		{
			path: '/我的评论',
			name: 'MyComment',
			component: () => import('@/pages/myComment'),
			meta: {
				// 自定义规则
				auth: true // 设置为true的路由是需要登录权限的
			}
		},

		{
			path: '/排行榜',
			name: 'Rank',
			component: () => import('@/pages/rank')
		},
		/* 总分类 */
		{
			path: '/分类',
			name: 'Category',
			component: () => import('@/pages/category'),
		},
		/* 某类书籍 list */
		{
			path: '/分类/:id',
			name: 'CategoryContent',
			component: () => import('@/pages/categoryContent')
		},
		{
			path: '/我的',
			name: 'My',
			component: () => import('@/pages/my'),
			// children:[
			// 	// {
			// 	// 	path: '修改个人信息',
			// 	// 	name: 'GhangeInfo',
			// 	// 	component: () => import('@/pages/changeInfo')
			// 	// },
			// 	// {
			// 	// 	path: '消息中心',
			// 	// 	name: 'GhangeInfo',
			// 	// 	component: () => import('@/pages/changeInfo')
			// 	// }，
			// 	// {
			// 	// 	path: '我的账户',
			// 	// 	name: 'GhangeInfo',
			// 	// 	component: () => import('@/pages/changeInfo')
			// 	// }，
			// 	// {
			// 	// 	path: '设置',
			// 	// 	name: 'GhangeInfo',
			// 	// 	component: () => import('@/pages/changeInfo')
			// 	// }
			// ],
			meta: {
				// 自定义规则
				auth: true // 设置为true的路由是需要登录权限的
			}
		},
		{
			path: '/登录',
			name: 'Login',
			component: () => import('@/pages/login')
		},
		{
			path: '/注册',
			name: 'Register',
			component: () => import('@/pages/register')
		},
		// 除以上明确路由外其他路径匹配到首页
		{
			path: '*',
			redirect: '/首页'
		}
    ]
})
  // 前端路由拦截
router.beforeEach(function (to, from, next) {
	// 获取 token
	let token = sessionStorage.getItem('token')
	// 历史记录
	if (sessionStorage.getItem('history')) {
		let history = sessionStorage.getItem('history') + ',' + to.fullPath
		sessionStorage.setItem('history', history)
	} else {
		sessionStorage.setItem('history', to.fullPath)
	}
	// 判断即将访问的路由是否需要登录权限
    if (to.meta.auth) {
		if (token) {
			next()
		} else {
			console.log(to.fullPath)
			next({
			path: '/登录',
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
