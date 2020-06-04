<template>
    <div>
        <div class="shelf-nav-bar">
            <van-sticky>
             <div class="my-nav-bar">
                <van-nav-bar
                left-arrow
                @click-left="backStep"
                >
                <div slot="title" class="shelf-button">
                    <van-button color="#f75000" :plain="isPlain[0]" @click="myShelf">我的书架</van-button>
                    <van-button color="#f75000" :plain="isPlain[1]" @click="latelyRead">最近阅读</van-button>
                </div>
                <van-icon name="wap-nav" size="26" slot="right" @click="showMenu" />
                </van-nav-bar>
            </div>
            </van-sticky>
            <!-- 弹出导航菜单 -->
            <Menu :msg="show"></Menu>
        </div>
        <!-- 书籍 list -->
        <ShelfContent :msg="activeButton"></ShelfContent>
    </div>
	
</template>
<script>
import ShelfContent from '../components/shelfContent'
import Menu from '../components/menu'
export default {
    name: 'Shelf',
    components:{
        ShelfContent,
        Menu,
    },
    data() {
      return {
        show: false,
        activeButton: '',
        isPlain: [false,true],
      };
    },
    created(){
        this.activeButton = this.$route.params.name
        this.isPlain = this.activeButton == 'myShelf'?[false,true]:[true,false]
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
        /* 标题按钮点击事件 切换书籍list内容 button样式 */
        myShelf(){
            this.isPlain[1] = true
            this.isPlain[0] = false
            this.activeButton = 'myShelf'
        },
        latelyRead(){
            this.isPlain[0] = true
            this.isPlain[1] = false
           this.activeButton = 'latelyRead'
        },
    },
}
</script>
<style>
/* 标题button 高度 */
.shelf-button .van-button {
    height: 36px;
    line-height: 34px;
}
</style>