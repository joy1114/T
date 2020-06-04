<template>

    <div class="rank-topfive">
            <!-- 
                1. 阅读榜 总阅读数前5
                2. 收藏榜
                3. 好评榜
                4. 更新榜
             -->
            <div class="rank-itembox">
                <van-row>
                    <van-col span="8">
                        <van-row
                        class="rank-row"
                        v-for="(item,index) in rankType"
                        :key="index">
                            <van-col span="24">
                                <div class="rank-name"
                                :style="{ backgroundImage: `url(${item.images})`}"
                                @click="toRankMore()">
                                    <h2>{{item.name}}</h2>
                                    <div class="router-icon">
                                        <van-icon name="upgrade" color="#fafafa" size="2rem" />
                                    </div>
                                    
                                </div>
                            </van-col>
                        </van-row>
                    </van-col>
                    <van-col span="16">
                        <van-row class="rank-row">
                            <van-col span="24">
                                <van-cell
                                v-for="(book,i) in readRank[0]"
                                :key="book.book_id"
                                is-link
                                @click="toBookInfo(book.book_id,book.book_name)">
                                    <!-- 使用 title 插槽来自定义标题 -->
                                    <template #title>
                                        <span class="custom-title">{{i+1+'. '}}</span>
                                        <span>{{book.book_name}}</span>
                                    </template>
                                </van-cell>
                            </van-col>
                        </van-row>
                        <van-row class="rank-row">
                            <van-col span="24">
                                <van-cell
                                v-for="(book,i) in collectRank[0]"
                                :key="book.book_id"
                                is-link
                                @click="toBookInfo(book.book_id,book.book_name)">
                                    <!-- 使用 title 插槽来自定义标题 -->
                                    <template #title>
                                        <span class="custom-title">{{i+1+'. '}}</span>
                                        <span>{{book.book_name}}</span>
                                    </template>
                                </van-cell>
                            </van-col>
                        </van-row>
                        <van-row class="rank-row">
                            <van-col span="24">
                                <van-cell
                                v-for="(book,i) in ratingRank[0]"
                                :key="book.book_id"
                                is-link
                                @click="toBookInfo(book.book_id,book.book_name)">
                                    <!-- 使用 title 插槽来自定义标题 -->
                                    <template #title>
                                        <span class="custom-title">{{i+1+'. '}}</span>
                                        <span>{{book.book_name}}</span>
                                    </template>
                                </van-cell>
                            </van-col>
                        </van-row>
                        <van-row class="rank-row">
                            <van-col span="24">
                                <van-cell
                                v-for="(book,i) in wordRank[0]"
                                :key="book.book_id"
                                is-link
                                @click="toBookInfo(book.book_id,book.book_name)">
                                    <!-- 使用 title 插槽来自定义标题 -->
                                    <template #title>
                                        <span class="custom-title">{{i+1+'. '}}</span>
                                        <span>{{book.book_name}}</span>
                                    </template>
                                </van-cell>
                            </van-col>
                        </van-row>
                    </van-col>
                </van-row>



<!-- yi -->
                <!-- <van-row
                class="rank-row"
                type="flex"
                justify="space-between"
                v-for="(item,index) in rankType"
                :key="index"
                >
                    <van-col span="8">
                        <div class="rank-name"
                        :style="{ backgroundImage: `url(${item.images})`}"
                        @click="toRankMore()">
                            <h2>{{item.name}}</h2>
                            <div class="router-icon">
                                <van-icon name="upgrade" color="#fafafa" size="2rem" />
                            </div>
                            
                        </div>
                    </van-col>
                    <van-col span="16">
                        <van-cell
                        v-for="(book,i) in rankBooks[index]"
                        :key="book.book_id"
                        is-link
                        @click="toBookInfo(book.book_id,book.book_name)">
                            <template #title>
                                <span class="custom-title">{{i+1+'. '}}</span>
                                <span>{{book.book_name}}</span>
                            </template>
                        </van-cell>
                    </van-col>
                </van-row> -->
            </div>
            
    </div>
	
</template>
<script>
export default {
    name: 'RankTopFive',
    data() {
      return {
          channelName: this.msg.channel_name,
          rankType:[
              {
                  images:"https://qidian.gtimg.com/qdm/img/rank/rank-bg-11.d5b17.jpg",
                  name: "阅读榜",
              },
              {
                  images:"https://qidian.gtimg.com/qdm/img/rank/rank-bg-4.b5dae.jpg",
                  name: "收藏榜",
              },
              {
                  images:"https://qidian.gtimg.com/qdm/img/rank/rank-bg-7.d0472.jpg",
                  name: "好评榜",
              },
              {
                  images:"https://qidian.gtimg.com/qdm/img/rank/rank-bg-1.c077f.jpg",
                  name: "更新榜",
              }
          ],
          readRank: [],
          ratingRank: [],
          collectRank: [],
          wordRank: [],
          rankBooks: [],
      };
    },
    props: {
		msg: Object,
	},
    computed: {
    },
    watch: {
        // 动态监听 数据 刷新页面内容
        msg: function(to){
            this.channelName = to.channel_name
        }
    },
    created(){
        var that = this
        // 请求数据接口
/* 阅读 */
        that.$http.post('/rank/readrank',{
            channel: that.channelName
        }).then(res => {
            if(res.data.state === 200){
                this.readRank.push(res.data.data)
                // this.rankBooks.push(res.data.data)
                // console.log(this.ratingRank)
            }
        }).catch(err => {
            console.log(err)
        })
/* 好评 */
        that.$http.post('/rank/ratingsrank',{
            channel: that.channelName
        }).then(res => {
            if(res.data.state === 200){
                this.ratingRank.push(res.data.data)
                // this.rankBooks.push(res.data.data)
                // console.log(this.ratingRank)
            }
        }).catch(err => {
            console.log(err)
        })
/* 收藏 */
        that.$http.post('/rank/collectrank',{
            channel: that.channelName
        }).then( res => {
            if(res.data.state === 200){
                this.collectRank.push(res.data.data)
                // console.log(this.collectRank)
                // this.rankBooks.push(res.data.data)
            }
        }).catch(err => {
            console.log(err)
        })
/* 更新 */
        that.$http.post('/rank/wordnumrank',{
            channel: that.channelName
        }).then( res => {
            if(res.data.state === 200){
                this.wordRank.push(res.data.data)
                // console.log(this.wordRank)
                // this.rankBooks.push(res.data.data)
            }
        }).catch(err => {
            console.log(err)
        })

    },
    methods:{
        getReadRank(){
            // var that = this
            
        },
        toRankMore(){

        },
        toBookInfo(book_id,book_name){
            console.log('toBookInfo')
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
<style scoped>
.rank-itembox{
    margin-top: 0.6rem;
}
.rank-itembox .van-cell{
    padding: 0.3rem 0.8rem;
    text-align: left;
}
/* .rank-itembox:first-child{
    
} */
/* 包含:图片成比例放大,可能不会填满盒子。可用于适配  */
    /* background-size: contain; */
    /* background-position-x: center;
    background-position-y: center; */
    /* 背景图片显示尺寸(放大/缩小背景图) */
    /* 通过像素设置 */
    /* background-size: 200px 200px; */
    /* 通过百分比设置 */
    /* background-size: 50% 50%; */
    /* 覆盖:图片成比例填满盒子。可用于适配 */ 
.rank-row{
    margin: 0 auto 1rem;
}
.rank-name{
    position: relative;
    height: 10.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.rank-name h2{
    position: absolute;
    top: 30%;
    margin: 0 auto;
    color: #fafafa;
    font-size: x-large;
}
.rank-name .router-icon{
    position: absolute;
    top: 75%;
    
}
.rank-name .router-icon i{
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg); 	/* Opera */
}
</style>