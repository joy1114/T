<template>
    <div class="category-all">
        <div class="my-nav-bar">
            <van-nav-bar
            left-text="分类"
            left-arrow
            @click-left="backStep"
            >
                <van-icon name="wap-nav" size="26" slot="right" @click="showMenu" />
            </van-nav-bar>
        </div>
        <!-- 弹出导航菜单 -->
        <Menu :msg="show"></Menu>

        <div class="select-category">
            <van-sidebar v-model="activeKey" @change="onChange">
                <van-sidebar-item
                v-for="(item,index) in channelList"
                :key="index"
                :title="item" />
            </van-sidebar>
            <div class="category-items">
                <!-- 分类list -->
                <!-- 参数： 选中的频道名字 -->
                <CategoryItem :channelName="activeItem"></CategoryItem>
            </div>
        </div>
    </div>
</template>
<script>
import Menu from '../components/menu'
import CategoryItem from '../components/categoryItem'
export default {
    name: 'Category',
    components:{
        CategoryItem,
        Menu,
    },
    data() {
      return {
          show: false,
          activeKey: 0,
          channelList: [],
          activeItem: '',
      };
    },
    created(){
        var that = this
        // 请求数据接口
        that.getChannel()
    },
    methods:{
        backStep(){
            // console.log(sessionStorage.getItem('history'))
			let arr = sessionStorage.getItem('history').split(',')
			console.log(arr)
			let from = arr[arr.length-2]
			// console.log(from)
			let history = ''
			arr.splice((arr.length)-2,2)
			console.log('er')
			console.log(arr)
			arr.map((item) => history=history+ ','+item )
			// console.log(history)
			sessionStorage.setItem('history',history)
			this.$router.push({
				path: from
			})
        },
        showMenu(){
            this.show = this.show?false:true
        },
        getChannel(){
            this.$http.get('/book/channel').then(res => {
                if(res.data.state == 200){
                    res.data.data.map((item,index) => this.channelList[index] = item.channel_name)
                    this.activeItem = this.channelList[0]
                    console.log(this.activeItem)
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        onChange(index) {
            this.activeItem = this.channelList[index]
        },
    },
}
</script>
<style>
.select-category .van-sidebar,.category-items{
    float: left;
}
.select-category .van-sidebar{
    width: 20%;
}
.select-category .category-items{
    width: 80%;
}
</style>