<template>

    <div class="menu">
        <van-popup
        v-model="isShow"
        :get-container="getContainer"
        position="left"
        overlay-class="directory-overlay"
        :style="{ width: '80%',height: '100%' }"
        >
            <van-cell
            class="directory-title"
            title="目录" />
            <van-cell
            class="directory-item directory-cell van-ellipsis"
            v-for="(item,index) in directories"
            :key="index"
            :title="item" @click="toChapter(index)"/>
        </van-popup>
    </div>
	
</template>
<script>

export default {
    name: 'Menu',
    data() {
      return {
          isShow: false,
          book_id: '',
          directories: [],
      };
    },
    props:{
        msg: Object,
    },
    watch: {
        msg(to){
            this.isShow = to.isShow
            this.book_id = to.book_id
        }
    },
    created(){
        var that = this
        that.$http.get('/book/titles?bookid='+that.book_id).then( res => {
            if(res.data.state === 200){
                that.directories = res.data.data.titles.split('-')
            }
        }).catch(err => {
            console.log(err)
        })
    },
    methods:{
        /* 跳转到书架页 */
        toChapter(title){
            this.$router.push({
                path: '/阅读/'+this.msg.book_id,
                query:{
                    title: title
                }
            })
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