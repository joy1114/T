<template>
	<div class="read" ref="read">
	<!-- 封面 -->
		<transition name="cover">
			<div ref="cover" class="content-cover" v-if="showMenu.showCover">
				<div class="cover">
					<div class="van-hairline--surround">
						<van-image :src="Book.images">
								<template v-slot:loading>
								<van-loading type="spinner" size="20" />
								</template>
						</van-image>
					</div>
					<h3>{{Book.book_name}}</h3>
					<span>{{Book.author+"  著"}}</span>
					<div class="read-number">
						<van-row type="flex" justify="space-around">
							<van-col span="6">
								<h4>{{Book.category}}</h4>
								<span>书籍类型</span>
							</van-col>
							<van-col span="6">
								<h4>{{Book.book_status}}</h4>
								<span>状态</span>
							</van-col>
							<van-col span="6">
								<h4>{{Book.word_count+'万'}}</h4>
								<span>字数</span>
							</van-col>
						</van-row>
					</div>
					<h5>本书由****网络进行电子制作与发行</h5>
					<h6>版权所有 侵权必究</h6>
				</div>
			</div>
		</transition>
		<div class="top-nav">
			<van-nav-bar
			v-if="showMenu.showTop"
			:fixed="true"
			left-arrow
			:left-text="Book.book_name"
			@click-left="backStep">
				<van-icon name="more" size="26" slot="right" @click="showMoreMenu" />
			</van-nav-bar>
			<!-- 当前章节标题 -->
			<van-nav-bar
			v-else
			:fixed="true"
			:left-text="nowTitle"
			/>
		</div>
		<!-- 弹出更多导航菜单 -->
		<van-sticky :offset-top="46">
			<van-popup
			v-model="showMenu.showMore"
			:get-container="getContainer"
			position="right"
			overlay-class="more-menu-overlay"
			:style="{ height: '25%' }"
			>
				<van-cell title="书籍详情" icon="shop-o" @click="toBookInfo" />
				<van-cell title="返回我的书架" icon="shop-o" to="/书架" />
			</van-popup>
		</van-sticky>
		<!-- 底部标签导航 tabbar -->
		<div class="read-bottom-bar" v-if="showMenu.showBottom">
			<div class="turnbar">
				<van-tabbar>
					<van-nav-bar
					left-text="上一章"
					left-arrow
					style="width: 100%;height: 100%"
					@click-left="preChapter"
					@click-right="nextChapter" >
						<div slot="right">下一章
							<van-icon name="arrow" />
						</div>
					</van-nav-bar>
				</van-tabbar>
			</div>
			<van-tabbar v-model="bottomActive">
				<van-tabbar-item icon="bars" @click="clickBottomMenu(bottomActive)">目录</van-tabbar-item>
				<van-tabbar-item icon="setting-o" @click="clickBottomMenu(bottomActive)">设置</van-tabbar-item>
				<van-tabbar-item v-if="isNight" icon="setting-o" @click="clickBottomMenu(bottomActive)">夜间</van-tabbar-item>
				<van-tabbar-item v-else icon="setting-o" @click="clickBottomMenu(bottomActive)">日间</van-tabbar-item>
			</van-tabbar>
		</div>
		<!-- 目录列表 -->
		<van-sticky>
			<van-popup
			v-model="showMenu.showDirectory"
			:get-container="getContainer"
			:lazy-render="false"
			position="left"
			overlay-class="directory-overlay"
			:style="{ width: '80%',height: '100%' }"
			>
				<van-cell
				class="directory-title"
				title="目录" />
				<van-cell
				:ref="(index+1)"
				class="directory-item directory-cell van-ellipsis"
				v-for="(item,index) in directories"
				:key="index"
				:title="item" @click="toChapter(index)"/>
			</van-popup>
		</van-sticky>
		<!-- 设置区 -->
		<van-sticky>
			<van-popup
			v-model="showMenu.showSetting"
			position="bottom"
			:style="{ height: '20%' }"
			>
				<van-nav-bar
				class="set-font"
				left-text="A-"
				right-text="A+"
				@click-left="fontUp"
				@click-right="fontDown">
				</van-nav-bar>
				<div class="set-color">
					<div class="set-color-item">
						<van-button ref="colorone" class="button-active" round size="large" color="#fff" @click="turnColor('colorone')"></van-button>
					</div>
					<div class="set-color-item">
						<van-button ref="colortwo" round size="large" color="lavender" @click="turnColor('colortwo')"></van-button>
					</div>
					<div class="set-color-item">
						<van-button ref="colorthree" round size="large" color="lightgreen" @click="turnColor('colorthree')"></van-button>
					</div>
					<div class="set-color-item">
						<van-button ref="colorfour" round size="large" color="rgb(49, 56, 90)" @click="turnColor('colorfour')"></van-button>
					</div>
				</div>
			</van-popup>
		</van-sticky>
		<div class="read-content"
		ref="content"
		:style="{background: style.background,color: style.color,
		'font-size': style.fontSize+'px',
		filter: 'brightness('+[isNight?0.1:1]+')'}">
			<!-- 书籍内容 上拉 上一章 下拉 下一章 -->
			<div class="content">
				<van-pull-refresh v-model="loadList.ispre"
				pulling-text="下拉即可回到上一章"
				loosing-text="释放即可返回上一章"
				@refresh="onRefresh">
					<van-list
					v-model="loadList.loading"
					:immediate-check="loadList.immediateCheck"
					:error.sync="loadList.error"
					error-text="请求失败，点击重新加载"
					:finished="loadList.finished"
					finished-text="读完了哦！看看其他书籍吧。"
					@load="onLoad"
					>
						<div
						slot="default"
						v-for="(item,index) in contentList"
						:key="index"
						>
							<h4 :class="item.title">{{item.title}}</h4>
							<div v-html="item.content"></div>
						</div>
					</van-list>
				</van-pull-refresh>
			</div>
		</div>
	</div>
</template>
<script>
	import {Toast} from 'vant'
	export default {
		name:"Read",
		components: {
			// Menu
		},
		data() {
			return {
				showMenu: {
					showTop: false,
					showBottom: false,
					showMore: false,
					showDirectory: false,
					showSetting: false,
					showCover: false,
				},
				bottomActive: 0,
				colorActive: 0,
				readPercentage: 0,
				style:{
					fontSize: 16,
					color: '#000',
					background: '#fff',
					brightness: 1,
				},
				isNight: false,
				loadList: {
					loading: false,
					immediateCheck: true,
					error: false,
					finished: false,
					ispre: false,
				},
				Book: {
					book_id: '',
					book_name: '',
				},
				nowTitle: '',
				title_id: 0,
				contentList: [],				
				directories:[],
				touch:{
					startY:0,
					yOffset: 0,
					pos: 0,
					direct: 0,
				}
			};
		},
		computed:{
			// isNight: function(){
			// 	return this.$store.getters.User.night
			// }
		},
		created() {
			this.Book.book_id = this.$route.params.id
			this.title_id = parseInt(this.$route.query.title)

			this.$http.get('/book/addreadnum?book_id='+this.Book.book_id)
			/* 请求书籍基本信息 */
			this.$http.get('/book/one?book_id='+this.Book.book_id)
			.then(res =>{
				if(res.data.state == 200){
					this.Book = res.data.data
				}else{
					Toast.fail('出错了')
				}
			}).catch(err =>{
				console.log(err)
			})
			/* 请求目录列表 */
			this.$http.get('/book/titles?bookid='+this.Book.book_id).then( res => {
				if(res.data.state === 200){
					this.directories = res.data.data.titles.split('-')
				}
			}).catch(err => {
				console.log(err)
			})

		},
		mounted() {
			this.$refs.content.addEventListener("touchstart", this.touchStart)
			this.$refs.content.addEventListener("touchmove", this.touchMove)
			this.$refs.content.addEventListener("touchend", this.touchEnd)
		},
		
		methods: {
			/* top nav-bar 更多菜单显示 */
			showMoreMenu(){
				this.showMenu.showMore = true
			},
			backStep(){
				let arr = sessionStorage.getItem('history').split(',')
				let from = arr[arr.length-2]
				// console.log(from)
				let history = ''
				arr.splice((arr.length)-2,2)
				arr.map((item) => history=history+ ','+item )
				// console.log(history)
				sessionStorage.setItem('history',history)
				this.$router.push({
					path: from
				})
			},
			/* 跳转 书籍详情 */
			toBookInfo(){
				this.$router.push({
					path: '/详情/'+this.Book.book_id,
					query:{
						book_name: this.Book.book_name
					}
				})
			},
			// 返回 DOM 节点 .top-nav，改变more-menu 和 目录 挂载的父节点 使在屏幕遮罩任意位置点击关闭
			getContainer() {
				return document.querySelector('.top-nav');
			},
			/* 底部 tabbar 菜单点击 */
			clickBottomMenu() {
				this.showMenu.showMore = false
				switch(this.bottomActive){
					case 0:
						this.showMenu.showBottom = false
						this.showMenu.showDirectory = true
						break;
					case 1:
						this.showMenu.showBottom = false
						this.showMenu.showSetting = true
						break;
					case 2:
						this.isNight = this.isNight?false:true
				}
			},
			/* 目录点击跳转到相应章节 */
			toChapter(title){
				this.showMenu.showDirectory = false
				this.title_id = title
				this.finished = false
				this.loading = true
				this.onLoad()
			},
			/* 切换上一章 下一章 */
			preChapter(){
				this.loadList.ispre = true
				this.onRefresh()
			},
			nextChapter(){
				this.loadList.loading = true
				this.onLoad()
			},
			/* 样式设置 */
			turnColor(color){
				document.querySelector('.button-active').classList.remove('button-active')
				if(color === 'colorfour' ){
					this.style.color = '#fff'
				}
				this.$refs[color].classList.add('button-active')
				this.style.background = this.$refs[color].style['background-color']
			},
			fontUp(){
				if(this.style.fontSize >13){
					this.style.fontSize--
				}else{
					Toast('已经是最小字号了')
				}
			},
			fontDown(){
				if(this.style.fontSize <100){
					this.style.fontSize++
				}else{
					Toast('已经是最大字号了')
				}
			},
			touchStart(ev) {
				this.startY = ev.touches[0].pageY
				this.pos = ev.touches[0].clientY				
			},
			touchMove(ev) {
				if(!this.startY){
					this.startY = ev.changedTouches[0].pageY
				}
			},
			touchEnd(ev) {
				let target = 0
				this.direct = this.startY - ev.changedTouches[0].pageY
				if(this.direct > 0){
					console.log('上滑动')
				}else if(this.direct === 0){
					/* 点击上区域 */
					if(this.pos < (window.innerHeight/3)){
						target = window.pageYOffset - window.innerHeight - 70
						this.startScroll(target)
					}else if(this.pos > (2*(window.innerHeight/3))){
						target = window.pageYOffset + window.innerHeight - 70
						this.startScroll(target)
					}else{
						this.showMenu.showTop = this.showMenu.showTop?false:true
						this.showMenu.showBottom = this.showMenu.showBottom?false:true
					}
				}else{
					console.log('下滑动')
				}
			},
			startScroll(target){
				window.scrollTo(0,target)
			},
			onLoad: function() {
				// ajax 请求每一章内容
				/* 下拉 下一章 */
				this.$http.post('/book/content',{
					book_id: this.Book.book_id,
					title_id: this.title_id+1,
				}).then(res =>{
					if(res.data.state === 200){
						if(JSON.stringify(res.data.data.title).length){
							let stringArr= res.data.data.content.split('-')
							
							let title = res.data.data.title
							let chapter = ''
							stringArr.map((item) => {
								chapter += '<p>' + item + '</p>'
							})
							if(this.contentList.length == 1){
								let target = this.loadList.ispre?0:-window.pageYOffset
								this.startScroll(target)
								this.contentList.shift()
							}
							this.contentList.push({
								title: title,
								content: chapter})
							this.nowTitle = title
							this.title_id += 1
							this.loadList.loading = false
							this.loadList.ispre = false
						}else{
							this.loadList.finished = true
						}
					}
				}).catch(err =>{
					this.error = true;
					console.log(err)
				})
							
			},
			onRefresh(){
				/* 上拉 上一章 */
				console.log(this.title_id)
				if(this.title_id == 1){
					Toast.fail('已经是第一章了哦！')
					this.loadList.ispre = false
				}else{
					this.finished = false
					this.title_id -= 2
					this.loading = true
					this.onLoad()
				}
				
			},
		},
		/* 跳转之前 保存阅读记录 */
		beforeRouteLeave:async function (to, from, next) {
			if(this.$store.getters.Token){
				let params = {
					user_id: this.$store.getters.User.user_id,
					book_id: this.Book.book_id,
					chapter: this.title_id
				}
				await this.$http.post('/user/addLatelyRead', params).then(res => {
					if (res.data.state == 200) {
						this.$store.getters.bookIsReaded ? this.$store.dispatch('UpdateLatelyRead', params) : this.$store.dispatch('AddLatelyRead', params)
						
					}
				})
				next()
			}else{
				next()
			}
			

			
		}
	}
</script>

<style scoped>
html,
body {
  height: 100%;
}
/* 媒体查询 操作区高度适配 */
/* @media screen and (min-width: 320px) and (max-width: 360px){
	.content-cover{
		height: 568px;
	}
}
@media screen and (min-width: 360px) and (max-width: 375px){
	.content-cover{
		height: 667px;
	}
}
@media screen and (min-width: 375px) and (max-width: 414px){
	.content-cover {
		height: 736px;
	}
}
@media screen and (min-width: 414px) and (max-width: 768px){
	.content-cover {
		height: 1024px;
	}
}
@media screen and (min-width: 768px) and (max-width: 1024px){
	.content-cover {
		height: 1366px;
	}
} */
.read .top-nav{
	height: 47px;
}
.read .van-nav-bar--fixed {
    background-color: rgb(78, 65, 65);
	z-index: 100;
}
.read .van-nav-bar--fixed,
.read .read-bottom-bar .van-tabbar,
.read>>>.van-popup,
.read>>>.van-popup--bottom .van-nav-bar,
.turnbar>>> .van-nav-bar {
    background-color: rgb(78, 65, 65);
}
.read .van-nav-bar--fixed .van-nav-bar__text ,
.read .van-nav-bar .van-icon,
.read .read-bottom-bar .van-tabbar-item,.read>>>.van-popup--bottom .van-nav-bar,
.read>>>.van-popup--bottom .van-nav-bar .van-nav-bar__text,
.turnbar>>>.van-nav-bar .van-nav-bar__text,
.turnbar>>>.van-nav-bar .van-nav-bar__right  {
    color: #fff;
}
.read>>>.van-popup--right {
    top: 21%;
	right: 1px;
	z-index: 100!important;
}
.read .van-popup--right .van-cell {
	text-align: left;
	color: #fff;
	background-color: rgb(78, 65, 65);
}
.read>>>.more-menu-overlay.van-overlay{
	top: 46px;
	z-index: 99!important;
}
/* 底部标签 导航栏 层级  van粘性布局 为99 */
.read-bottom-bar .van-tabbar {
    z-index: 100;
}
/* .read-bottom-bar>>>.van-hairline--top-bottom::after {
    border-width: 0;
} */
.read-bottom-bar>>>.van-nav-bar--fixed{
	top: 100px;
}
.read-bottom-bar>.turnbar>>>.van-tabbar{
	bottom: 50px;
}
.set-color{
	position: absolute;
	width: 100%;
	bottom: 0;
	top: 47px;
    display: flex;
    justify-content: space-around;
}
.set-color-item{
    width: 20%;
	height: 50px;
	display: inline-block;
	position: relative;
	top: 50%;
	margin-top: -25px;
}
.set-color-item>.button-active{
    border: 2px solid orangered!important;
}
.set-font .van-nav-bar__text {
	font-size: 1.5rem;
}
/*
.top-nav>.van-hairline--bottom::after {
    border-bottom-width: 0px;
} */
/* 进度条 弹出层 */
/* .read>>>.van-popup--bottom {
    bottom: 47px;
    left: 0;
    width: 100%;
}
.read>>>.van-popup--bottom .van-progress{
	width: 85%;
	margin: 35px auto;
} */
/* 封面 */
.content-cover {
    position: absolute;
    width: 100%;
    top: 0px;
    background: white;
	display: flex;
	align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0 auto;
    z-index: 101;
}
/* border */
.content-cover .cover{
	width: 90%;
	border: 1px solid lightgray;
	padding-top: 10%;
	padding-bottom: 10%;
	margin: 5% 5%;
}
/* 图片 */
.content-cover .van-image{
	height: 9rem;
    width: 7rem;
}
/* 图片边框 */
.content-cover .van-hairline--surround{
	margin: 0 auto 5px;
	height: 9.5rem;
	width: 7.5rem;
}
/* 图片与边框边距 */
.content-cover .book-img{
	margin: 10%;
}
/* 封面文字 边距 */
.content-cover h3{
	margin: 0px auto 3px;
}
/* 封面过渡 */
.content-cover-enter-active, .content-cover-leave-active {
  transition: opacity .5s;
}
.contet-cover-enter, .content-cover-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.read-number{
	margin: 10% auto 17%;
}
.read-number h2{
    display: block;
    font-size: 1.5em;
}
.read-number h4{
	font-size: 15px;
	margin-bottom: 3px;
}
.read-number span{
	font-size: 13px;
}
/* 章节内容 */
.read-content{
	padding-right: 5%;
	padding-left: 5%;
	text-align: left;
	text-indent: 2rem;
}
/* 目录 */
.directory-title{
	color: red;
	border-bottom: 1px solid red;
}
.directory-cell{
	text-align: left;
}
.directory-item{
	font-size: 11px;
}
</style>
