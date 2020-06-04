<template>
	<div class="category-content">
		<div class="my-nav-bar">
            <van-nav-bar
            :left-text="category_name"
            left-arrow
            @click-left="backStep"
            >
                <van-icon :name="menuIcon" size="26" slot="right" @click="showMenu" />
            </van-nav-bar>
        </div>
        <!-- 弹出导航菜单 -->
        <Menu :msg="show"></Menu>
		<!-- 书籍 list -->
		<div class="category-book-list">
			<van-card
            v-show="categoryBook[0]"
			v-for="item in categoryBook"
            :key="item.book_id"
            :desc="item.book_intro"
            :title="item.book_name"
            :thumb="item.images"
			@click="bookInfo(item.book_id,item.book_name)"
            >
			<!-- 自定义 card footer  作者及状态标签 -->
				<div slot="footer">
                    <van-row type="flex" justify="space-between">
                        <van-col span="8" offset="6" class="author">
                            <van-icon name="manager" size="mini">{{item.author}}</van-icon>
                        </van-col>
                        <van-col span="12" class="tags">
                            <van-tag plain type="danger">{{item.category}}</van-tag>
                            <van-tag plain type="danger">{{item.book_status}}</van-tag>
                        </van-col>
                    </van-row>
                </div>
            </van-card>
		</div>
	</div>
</template>

<script>
	import Menu from '@/components/menu.vue'
export default {
	name: 'CategoryContent',
	components:{
        Menu,
    },
	data(){
		return{
			show: false,
			menuIcon: 'wap-nav',
			categoryBook: [],
			category_name: '',
		}
	},
	created(){
		// 初始化数据
		var that = this
		// 分类名
		that.category_name = that.$route.params.id
		// 请求数据
		that.getBook(that.category_name)
	},
	methods: {
		backStep(){
            // console.log(sessionStorage.getItem('history'))
			let arr = sessionStorage.getItem('history').split(',')
			console.log(arr)
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
		showMenu(){
            if(this.menuIcon === 'wap-nav'){
                this.menuIcon = 'cross' 
                this.show = true
            }else{
                this.menuIcon = 'wap-nav'
                this.show = false
            }
        },
		/* 分类请求接口 */
		getBook: function(category_name) {
			var that = this
			that.$http.post("/book/categoryQurry", {
				category: category_name
			}).then(function (res) {
				if(res.data.state === 200){
					that.categoryBook = res.data.data
				}					
			}).catch(function (err) {
				console.log(err)
			})
		},
		/* 跳转 书籍详情 */
		bookInfo(book_id,book_name){
            this.$router.push({
                path: '/详情/'+book_id,
                query:{
                    book_name: book_name
                }
            })
        },

	}

}
</script>

<style>
/* 标题 居左 */
.category-book-list .van-card__content{
    text-align: left;
}
/* 描述 div 大小 */
.category-book-list .van-card__desc {
    color: #9aa6b3;
    line-height: 18px;
    max-height: 100%;
}
/* 描述超出3行省略... */
.category-book-list .van-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    white-space: normal;
}
.category-book-list .van-card__footer .author{
    text-align: left;
}
.category-book-list .van-card__footer .tags{
    text-align: right;
}
</style>