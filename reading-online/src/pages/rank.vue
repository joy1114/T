<template>

    <div class="sort">
        <van-sticky>
             <div class="my-nav-bar">
                <van-nav-bar
                left-text="排行榜"
                left-arrow
                @click-left="backStep"
                >
                <van-icon name="wap-nav" size="26" slot="right" @click="showMenu" />
                </van-nav-bar>
            </div>
            </van-sticky>
            <!-- 弹出导航菜单 -->
            <Menu :msg="show"></Menu>
            <!-- 频道 tab -->
            <div class="rank-tap">
                <van-tabs>
                    <van-tab v-show="channelList" v-for="item in channelList" :title="item.channel_name" :key="item.channel_id">
                        <div class="channel-content">
                            <RankTopFive :msg="item"></RankTopFive>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
            
    </div>
	
</template>
<script>
import Menu from '../components/menu'
import RankTopFive from '../components/rankTopFive'
export default {
    name: 'Sort',
    components:{
        Menu,
        RankTopFive,
    },
    data() {
      return {
        show: false,
        channelList: [],
      };
    },
    computed: {
    },
    watch: {
        // 动态监听 数据 刷新页面内容
    },
    created(){
        // 请求数据接口
        var that = this
        that.getChannel()
    },
    methods:{
        showMenu(){
            this.show = this.show?false:true
        },
        backStep(){
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
    },
}
</script>
<style scoped>
.rank-tap{
    background: #fafafa;
}
</style>