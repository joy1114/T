<template>
    <div>
        <!-- 导航条 -->
        <div class="my-comment-nav">
            <div class="comment-nav-bar">
                <van-nav-bar
                left-text="我的评论"
                left-arrow
                @click-left="backStep"
                >
                 <van-icon :name="menuIcon" size="26" slot="right" @click="showMenu" />
                </van-nav-bar>
            </div>
            <!-- 弹出导航菜单 -->
            <Menu :msg="show"></Menu>
		</div>
    </div>
	
</template>
<script>
import Menu from '../components/menu'
export default {
    name: 'MyComment',
    components:{
        Menu,
    },
    data() {
      return {
        show: false,
        menuIcon: 'wap-nav',
        books: [],
      };
    },
    computed: {
    },
    watch: {
        // 动态监听 数据 刷新页面内容
        // categoryList: {
        //     handler: function(to) {
        //         this.categoryList = to
        //     },
        //     deep: true
        // },
    },
    created(){
        // 请求数据接口
    },
    methods:{
        showMenu(){
            if(this.menuIcon === 'wap-nav'){
                this.menuIcon = 'cross' 
                this.show = true
            }else{
                this.menuIcon = 'wap-nav'
                this.show = false
            }
        },
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
    },
}
</script>
<style>
</style>