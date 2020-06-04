<template>

    <div class="menu">
        <van-popup
        v-model="isShow"
        round
        position="top"
        overlay-class="menu-overlay"
        :style="{ height: '35%' }"
        >
            <van-grid clickable :column-num="3">
                <van-grid-item icon="wap-home" text="首页" to="/首页" />
                <van-grid-item icon="send-gift" text="分类" to="/分类" />
                <van-grid-item icon="ascending" text="排行榜" to="/排行榜" />
                <van-grid-item icon="smile" text="免费" to="/" />
                <van-grid-item icon="gift" text="完本" to="/" />
                <van-grid-item icon="manager" text="账户" to="/我的" />
            </van-grid>
            <van-row type="flex" justify="center" style="margin-top: 0.5rem">
                <van-col span="19">
                    <van-button round block color="#7232dd" @click="goShelf">
                    我的书架
                    </van-button>
                </van-col>
            </van-row>
            
        </van-popup>
    </div>
	
</template>
<script>

export default {
    name: 'Menu',
    data() {
      return {
          isShow: false,
      };
    },
    props:{
        msg: Boolean,
    },
    watch: {
        msg(to){
            this.isShow = to
        }
    },
    created(){
    },
    methods:{
        /* 跳转到书架页 */
        goShelf(){
            if(this.$route.path.substring(0,3) === '/书架'){
                this.isShow = false
            }
            else{
                this.$router.push('/书架/myShelf')
            }
            
        },
    },
}
</script>
<style>
/* menu 位置调整 */
.menu .van-popup--top {
    top: 46px;
}
.menu-overlay{
    top: 46px;
}
</style>