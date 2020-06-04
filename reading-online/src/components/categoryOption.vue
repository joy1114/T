<template>

    <div class="home-content">
        <div class="carousel">
            <!-- 轮播图 -->
                <van-swipe class="my-swipe" :autoplay="4000" indicator-color="#f75000">
                    <van-swipe-item v-for="item in swipeBook" :key="item.book_id">
                        <img
                        :src="item.url"
                        width="100%"
                        fit="cover"
                        @click="bookInfo(item.book_id,item.book_name)">
                    </van-swipe-item>
                </van-swipe>
        </div>
        <!-- 菜单list -->
        <div class="home-nav-item">
            <!-- 分类list -->
            <van-grid clickable :column-num="4" :gutter="5">
                <van-grid-item
                v-for="(item,index) in navList"
                :key="index"
                :text="item.name"
                :to='item.url'
                >
                <div slot="icon">
                    <i :class="item.icon" style="font-size: 2rem;color: #f75000;"></i>
                </div>
                </van-grid-item>
            </van-grid>
            <!-- <CategoryItem :channelName="channel_name"></CategoryItem> -->
        </div>
         <!-- 主编推荐书籍 -->
        <div class="home-category-content">
            <h3>热门小说</h3>
            <!-- 第一本 -->
            <van-card
            v-if="firstHot"
            :desc="firstHot.book_intro"
            :title="firstHot.book_name"
            :thumb="firstHot.images"
            tag="Hot"
            @click="bookInfo(firstHot.book_id,firstHot.book_name)"
            >
                <div slot="tags">
                    <van-row type="flex" justify="space-between">
                        <van-col span="12" class="author">
                            <van-icon name="manager" size="mini">{{firstHot.author}}</van-icon>
                        </van-col>
                        <van-col span="12" class="tags">
                            <van-tag plain type="danger">{{firstHot.category}}</van-tag>
                            <van-tag plain type="danger">{{firstHot.book_status}}</van-tag>
                        </van-col>
                    </van-row>
                </div>
            </van-card>
            <!-- 第二本及后面几本 -->
            <van-row class="hotnovel" type="flex" justify="space-around">
                <van-col
                v-for="(item) in hotBook"
                :key="item.book_id"
                span="6"
                @click="bookInfo(item.book_id,item.book_name)"
                >
                    <van-image
                    width="100%"
                    height="7.5rem"
                    fit="cover"
                    :src="item.images" />
                    <p>{{item.book_name}}</p>
                    <p icon="fire-o">{{item.votenumber}}</p>
                </van-col>
            </van-row>
            <!-- 本期精品书 -->
            <!-- <div class="special">
                <h3>本期精品</h3>
                <van-row type="flex" justify="space-around">
                    <van-col
                    v-for="item in suggestBook"
                    :key="item.book_id"
                    span="6"
                    @click="bookInfo(item.book_id,item.book_name)"
                    >
                        <van-image :src="item.images" />
                        <p>{{item.book_name}}</p>
                        <p icon="fire-o">{{item.votenumber}}</p>
                    </van-col>
                </van-row>
            </div> -->
            <!-- 热血玄幻书 -->
            <div class="categoryid"
            v-for="item in suggestBook.length"
            :key="item">
                <van-cell title="热血玄幻" value="更多玄幻好书" is-link to="index" />
                <van-row type="flex" justify="space-around">
                    <van-col
                    v-for="item in suggestBook"
                    :key="item.book_id"
                    span="6"
                    @click="bookInfo(item.book_id,item.book_name)"
                    >
                        <van-image
                        width="100%"
                        height="7.5rem"
                        fit="cover"
                        :src="item.images" />
                        <p>{{item.book_name}}</p>
                        <p icon="fire-o">{{item.ratings}}</p>
                    </van-col>
                </van-row>
            </div>
        </div>          
    </div>
	
</template>
<script>
// import CategoryItem from '@/components/categoryItem'
export default {
    name: 'categoryOption',
    components:{
        // CategoryItem,
    },
    data() {
      return {
        hotBook: [],
        firstHot: {},
        suggestBook: [],
        navList: [
            {
                name: '分类',
                icon: 'iconfont icon-shuangsechangyongtubiao-',
                url: '/分类'
            },
            {
                name: '排行榜',
                icon: 'iconfont icon-ranking',
                url: '/排行榜'
            },
            {
                name: '完本',
                icon: 'iconfont icon-wanjietuijian',
                url: '/分类'
            },
            {
                name: '连载',
                icon: 'iconfont icon-zuixinlianzai',
                url: '/分类'
            },
        ],
        swipeBook: [],
        channel_name: this.msg.channel_name,
      };
    },
    props: {
		msg: Object,
	},
    computed: {
    },
    watch: {
        // 动态监听 数据 刷新页面内容
        msg: {
            handler:function (to) {
                this.channel_name = to.channel_name
				// 调用请求数据函数 重新渲染页面内容
                this.getBook(to.channel_name)
            },
            deep:true
        },
    },
    created(){
        // 请求数据接口
        this.getImages(this.msg.channel_id)
        this.getHotBook(this.msg.channel_name)
        this.getRankBook(this.msg.channel_name)
    },
    methods:{
        getHotBook(channel_name){
            this.$http.post('/book/hot',{
                channel: channel_name,
            }).then(res => {
                if(res.data.state === 200){
                    this.hotBook = res.data.data
                    this.firstHot = this.hotBook.shift()
                }
            })
        },
        getRankBook(channel_name){
            this.$http.post('/book/finishHot',{
                channel: channel_name
            }).then( res =>{
                if(res.data.state == 200){
                    this.suggestBook = res.data.data
                    console.log(this.suggestBook)
                    // console.log(res.data.data.filter( item => item.channel === this.channel_name))
                }
            }).catch( err => {
                console.log(err)
            })
        },
        getImages(channel){
            this.$http.get('/channel/images?channel='+channel).then( res => {
                if(res.data.state == 200){
                    this.swipeBook = res.data.data
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        bookInfo(book_id,book_name){
            this.$router.push({
                path: '/详情/'+book_id,
                query:{
                    book_name: book_name
                }
            })
        },
    },
}
</script>
<style>
.carousel{
    margin: 0 auto;
    width: 80%;
}
/* .my-swipe{
    width: 100%;
    height: max-content;
} */
/* .my-swipe .van-swipe-item {
    width:100%;
} */
.home-nav-item{
    margin: 20px auto;
}
/* book card */
/* 标题居左 */
.home-category-content .van-card__content{
    text-align: left;
}
/* 描述 div 大小 */
.home-category-content .van-card__desc {
    color: #9aa6b3;
    margin-top: 0.3rem;
    line-height: 18px;
    max-height: 100%;
}
/* 描述超出3行省略... */
.home-category-content .van-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    white-space: normal;
}
/* card tags */
.home-category-content .tags{
    text-align: right;
}
.categoryid .van-cell{
    text-align: left;
}
.home-category-content .hotnovel{
    padding: 1rem 0;
    background: #fafafa;
}
.home-category-content .hotnovel p{
    margin: 0 auto;
}
/* .category-content .van-card-d */
</style>