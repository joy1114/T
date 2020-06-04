<template>
	<div id="book-info">
		<div class="my-nav-bar">
            <van-nav-bar
			:fixed="true"
            :left-text="book_name"
            left-arrow
            @click-left="backStep"
            >
                <van-icon name="wap-nav" size="26" slot="right" @click="showMenu" />
            </van-nav-bar>
        </div>
        <!-- 弹出导航菜单 -->
        <Menu :msg="show"></Menu>
		<div class="book-intro">
			<van-row type="flex">
				<van-col span="8">
					<van-image :src="book.images">
						<template v-slot:loading>
						<van-loading type="spinner" size="20" />
						</template>
					</van-image>
				</van-col>
				<van-col class="intro-content" span="12" offset="2">
					<h2>{{book.book_name}}</h2>
					<p>{{book.author}}</p>
					<div class="comment-number">
						<van-rate v-model="book.ratings"
						allow-half
						void-icon="star"
						void-color="#eee"
						readonly
						@change="onChange" />
					</div>
					<div class="book-tags">
						<van-tag plain color="#f75000" size="large">{{book.channel}}</van-tag>
						<van-tag plain color="#f75000" size="large">{{book.category}}</van-tag>
					</div>
				</van-col>
			</van-row>
		</div>
		<!-- 操作按钮区 -->
		<div class="book-options">
			<van-row type="flex" justify="space-around">
				<van-col span="7">
					<van-button color="#f75000" block plain :disabled="isDisabledAdd" @click="addShelf">{{isAdd}}</van-button>
				</van-col>
				<van-col span="7">
					<van-button color="#f75000" block @click="toReadPage">{{isReaded}}</van-button>
				</van-col>
			</van-row>
		</div>
		
		<div class="divider" style="height:0.6rem;width:100%;margin:1rem auto 0;background:#fafafa;"></div>

		<!-- 书籍内容简介文字区 -->
		<div class="book-intro-words">
			<!-- 最多显示三行 -->
			<div>
				<p class="van-multi-ellipsis--l3">{{book.book_intro}}</p>
				<button v-if="isShowMore" class="btn-more" ref="button" type="button" @click="clickBtton">展开</button>
			</div>
			
		</div>
		<div class="divider" style="height:0.6rem;width:100%;margin:1rem auto 0;background:#fafafa;"></div>
		<!-- 目录区 -->
		<div class="book-menu van-hairline--top">
			<van-cell
			value-class="van-multi-ellipsis--l"
			v-if="isFinished"
			title="目录"
			center
			is-link
			@click="showBookMenu" >
			<template slot="default">
				<div>
					<span>{{update_time}}</span>
					<span> 连载至{{directories[directories.length-1]}}</span>
				</div>
			</template>
			
			</van-cell>
			<van-cell v-else title="目录" center is-link :value="'已完结，共'+directories.length+'章'" @click="showBookMenu" />
			<!-- 目录菜单 -->
			<van-action-sheet v-model="isShowBookMenu" title="目录">
				<van-cell
				class="directory-item van-ellipsis"
				v-for="(item,index) in directories"
				:key="index"
				:title="item" @click="toChapter(index)"/>
			</van-action-sheet>
		</div>
		<div class="divider" style="height:0.6rem;width:100%;margin:auto 0;background:#fafafa;"></div>
		<!-- 评论区 -->
		<div class="book-comment">
			<BookComment></BookComment>
		</div>
	</div>
</template>

<script>
	import Menu from "../components/menu.vue";
	import BookComment from "../components/comment"
	export default {
		name: "BookInfo",
		components: {
			Menu,
			BookComment,
		},
		data() {
			return {
				show: false,
				isShowBookMenu: false,
				isShowMore: false,
				isDescStatus: true,
				book_name: '',
				book:{},
				isAdd: '',
				isDisabledAdd: '',
				isReaded: '',
				title: 0,
				directories: [],
				update_time: '',
				isFinished: Boolean,
			};
		},
		computed: {
			latelyread:function(){
				return this.$store.getters.userLatelyReadArray()
			},
			shelfarr:function(){
				return this.$store.getters.userShelfArray()
			},
			isbookReaded: function(){
				return this.$store.getters.bookIsReaded()
			}
			
		},
		watch:{
		},
		created() {
			var that = this
			// 用户是否已加入书架
			let arr = that.shelfarr
			arr = arr.length? arr.filter((item)=>item === parseInt(that.$route.params.id)) : []
			that.isAdd = arr.length?'已在书架':'加入书架'
			that.isDisabledAdd = arr.length?true:false
			/* 用户最近有没有读过 */
			
			let readed = false
			if(that.latelyread.length){
				that.latelyread[0].map( (item,index)=> {
					if(item === parseInt(that.$route.params.id)){
						this.title = that.latelyread[1][index]-1
						readed = true
					}
				})
			}
			that.isReaded = readed?'继续阅读':'开始阅读'
			that.$store.dispatch('IsReaded',that.isReaded)
			/* 获取图书信息 */
			that.book_name = that.$route.query.book_name
			that.$http.get('/book/one?book_id='+that.$route.params.id)
			.then( function(res){
				if(res.data.state === 200){
					that.book = res.data.data
					that.isShowMore=that.book.book_intro.length>60?true:false
					that.isFinished = res.data.data.status === '连载'?false:true
				}
			}).catch( function(err){
				console.log(err)
			})
			/* 请求目录列表 */
			that.$http.get('/book/titles?bookid='+that.$route.params.id).then( res => {
				if(res.data.state === 200){
					that.directories = res.data.data.titles.split('-')
					that.update_time = that.$common.intervalsTime(res.data.data.update_time)
				}
			}).catch(err => {
				console.log(err)
			})
		},
		methods: {
			clickBtton(){
				let el = this.$refs.button
				el.previousElementSibling.classList[!this.isDescStatus ? 'add' : 'remove']('van-multi-ellipsis--l3')
				el.classList[this.isDescStatus ? 'add' : 'remove']('more-collapse')
				el.innerHTML = !this.isDescStatus ? '展开' : '收起'
				this.isDescStatus = !this.isDescStatus
				this.isShowMore = true
			},
			backStep(){
				// console.log(sessionStorage.getItem('history'))
				let arr = sessionStorage.getItem('history').split(',')
				let from = arr[arr.length-2]
				let history = ''
				arr.splice((arr.length)-2,2)
				arr.map((item) => history=history+ ','+item )
				sessionStorage.setItem('history',history)
				this.$router.push({
					path: from
				})
			},
			showMenu(){
				this.show = this.show?false:true
			},
			
			/* 评分改变事件监听 */
			onChange(value) {
				this.$toast('当前值：'+ value)
			},
			/* 书籍目录展开 */
			showBookMenu(){
				this.isShowBookMenu = true
			},
			// 加入书架事件
			addShelf: function(){
				var that = this
				/* 判断是否是登录状态 */
				if (sessionStorage.getItem('token')) {
					let id = that.$route.params.id
					that.$http.post('/user/addshelf',{
					book_id: id.toString(),
					user_id: that.$store.getters.User.user_id
					}).then(function(res){
						if(res.data.state === 200){
							that.$store.dispatch('AddShelf',id.toString())
							that.$toast.success(res.data.msg)
							that.isDisabledAdd = true
							that.isAdd = '已在书架'
						}						
					}).catch(function(err){
						console.log(err)
						that.$toast.fail('出错了呢'+err)
					})

					/* 被收藏数量加一 */
					that.$http.get('/book/addcollectnum?book_id='+that.$route.params.id)
				}else{
					that.$dialog.confirm({
						title: '提示',
						message: '您还没有登录, 是否跳转去登陆?'
					}).then(() => {
					// on confirm
						that.$router.push('/登录')
					}).catch(() => {
					// on cancel
					})
				}
			},
			toReadPage(){
				var that = this
				that.$router.push({
					path: '/阅读/'+this.$route.params.id,
					query:{
						title: parseInt(that.title),
					}
				})
			},
			toChapter(title){
				this.title = title
				this.toReadPage()
			},
		},
		// beforeRouteEnter: function(to,from,next){
		// 	let book_id = to.params.id
		// 	let book_clicksnum = 
		// 	this.$http.get()
		// }
	};
</script>

<style scoped>
/* 书图 名 板块 */
/* book-info{
	background: #fafafa;
} */
.book-intro{
	margin-top: 47px;
	padding-top: 25px;
	padding-bottom: 10px;
	padding-left: 30px;
	padding-right: 10px;
	margin-bottom: 10px;
	text-align: left;
}
/* 图片阴影 大小 */
.book-intro .van-image{
	height: 9rem;
    width: 7rem;
	box-shadow:2px 2px 5px #333333;
	-webkit-box-shadow:2px 2px 5px #333333;
}
/* 书名字 、作者padding */
.intro-content h2{
	margin: 0 auto;
	padding-bottom: 8px;
}
.intro-content p{
	margin: 0px auto 10px auto;
}
.intro-content .comment-number{
	margin: 15px auto;
}
/* 内容简介 字体样式 */
.book-intro-words{
	padding: 1rem 1rem 1.5rem;
}
.book-intro-words p{
	margin: 0px auto;
	text-align: left;
	/* font-family: 'SimHei', Helvetica, sans-serif; */
	font-style: inherit;
	font-size: 1rem;
	line-height: 1.5rem;
	color: #756c6c;
	text-indent: 2rem;
}
/* zhankai */
.btn-more.more-collapse::after,
.btn-more.more-collapse::before {
	top: 2px;
	transform: rotate(180deg);
}
.btn-more.more-collapse::before {
	top: 4px;
}
.btn-more::after,
.btn-more::before {
	width: 0;
	height: 0;
	content: '';
	position: absolute;
	right: 0;
	top: 7px;
	border: rc(12) solid transparent;
} 
.btn-more::after {
	border-top-color: #5383E7;
	z-index: 1;
}
.btn-more::before {
	border-top-color: #1c2239;
	z-index: 2;
	top: 5px;
}
.btn-more{
	color: #fff;
	float: right;
	color: #5383E7;
	position: relative;
	border: 0;
	background: none;
	margin-top: rc(5);
	padding-right: rc(33);
}
.book-menu>.van-cell{
	text-align: left;
	font-size: 1rem;
}
.book-menu .van-cell__value{
	display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
	flex-grow: 3;
}
.book-menu .van-action-sheet__header {
    border-bottom: 1px solid orangered;
}
.directory-item{
	text-align: left;
	padding: 10px 35px;
}
</style>
