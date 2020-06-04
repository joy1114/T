<template>
	<!-- 分类list -->
    <div class="category-item">
        <van-grid clickable :column-num="3" :gutter="5">
        <van-grid-item
        v-for="item in categoryList"
        :key="item.category_id"
        icon="photo-o"
        :text="item.category_name"
        :to='"/分类/"+item.category_name'
        />
        </van-grid>
    </div>
</template>
<script>

export default {
    name: 'CategoryItem',
    data() {
      return {
        categoryList: {},
        channel_name: this.channelName,
      };
    },
    props:{
        channelName: String,
    },
    watch: {
        channelName: {
            handler:function (to) {
                this.channel_name = to
				// 调用请求数据函数 重新渲染页面内容
				this.getCategory(to)
            },
            deep:true
        },
    },
    created(){
        this.getCategory(this.channelName)
    },
    methods:{
        getCategory(channel_name){
            this.$http.post('/channel/category',{
                channel_name: channel_name
                }).then( res => {
                if(res.data.state == 200){
                    this.categoryList = res.data.data
                    
                }
            }).catch(err =>{
                console.log(err)
            })
        },
    },
}
</script>
<style>
</style>