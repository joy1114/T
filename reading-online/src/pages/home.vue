<template>

    <div>
        <div class="home-nav">
            <van-row type="flex" justify="space-bettween" style="align-items: center;">
                <!-- 网站名 -->
                <van-col span="5">
                    <span>享看小说</span>
                </van-col>
                <!-- 搜索框 -->
                <van-col span="13">
                    <Search></Search>
                </van-col>
                <van-col span="6">
                    <van-row type="flex" justify="space-around" style="align-items: center;">
                        <!-- 头像 -->
                        <van-col span="12">
                            <van-image
                            v-if="Token"
                            round
                            width="2rem"
                            height="2rem"
                            fit="cover"
                            src="https://img.yzcdn.cn/vant/cat.jpeg"
                            @click="goMy"
                            />
                            <van-icon
                            v-else
                            name="manager"
                            @click="goMy"
                            />
                        </van-col>
                        <!-- 书架 -->
                        <van-col span="12">
                            <van-icon name="bar-chart-o" size="30" @click="goShelf" />
                        </van-col>
                    </van-row>
                    
                </van-col>
            </van-row>
        </div>
        <div>
            <!-- 频道 -->
               <van-tabs>
                    <van-tab v-show="channelList" v-for="item in channelList" :title="item.channel_name" :key="item.channel_id">
                        <div class="channel-content">
                            <categoryOption :msg="item"></categoryOption>
                        </div>
                    </van-tab>
                </van-tabs>
        </div>
    </div>
	
</template>
<script>
import Search from "../components/search"
import categoryOption from "../components/categoryOption"
// import Notify from "vant"
export default {
    name: 'Home',
    components:{
        Search,
        categoryOption,
    },
    data() {
      return {
        categoryList:[],
        channelList:[],
      };
    },
    computed: {
        channelListobj: {
            get: function(){
                return this.channelList; // 在这里把临时对象的值通过计算属性赋值给页面中用到的对象
            }
        },
        Token: function(){
			return this.$store.state.token
		},
		User: function(){
			return this.$store.state.user.user_name
		},
    },
    watch: {
        // 动态监听 数据 刷新页面内容
        categoryList: {
            handler: function(to) {
                this.categoryList = to
            },
            deep: true
        },
        channelList: {
            handler: function(to) {
                this.channelList = to
            },
            deep: true
        }
    },
    created(){
        var that = this
        // 请求数据接口
        that.getChannel()
        that.getCategory()
    },
    methods:{
        goShelf(){
            console.log('goShelf')
            this.$router.push('/书架/myShelf')
        },
        goMy(){
            this.$router.push('/我的')
        },
        getChannel(){
            this.$http.get('/book/channel').then(res => {
                if(res.data.state == 200){
                    this.channelList = res.data.data
                }else{
                    console.log('出错了')
                }
            }).catch(err =>{
                console.log('请求失败'+err)
            })
        },
        getCategory(){
            this.$http.get('/book/category').then(res => {
                if(res.data.state == 200){
                    this.categoryList = res.data.data
                }
            }).catch(err =>{
                console.log(err)
            })
        }
    },
}
</script>
<style scoped>
.channel-content{
    height: 500px;
    width: 100%;
    margin: 10px auto
}
</style>