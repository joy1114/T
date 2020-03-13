<template>
    <el-container>
        <el-header>
            <h1>评论</h1>
        </el-header>
        <div class="split"></div>
        <el-main>
            <!-- 写评论 -->
            <el-row>
                <el-col :span="24">
                    <div class="grid-content" style="text-align:right;">
                        <el-input
                        type="textarea"
                        placeholder="发表自己的看法"
                        v-model="textarea"
                        maxlength="200"
                        show-word-limit
                        style="margin-bottom:10px;"
                        >
                        </el-input>
                        <el-button type="success" Circle>取消</el-button>
                        <el-button @click="submitCommit" type="success" Circle :Loading="isSubmit">发表</el-button>
                    </div>
                </el-col>
            </el-row>
            <p>精彩评论</p>
            <div class="split"></div>
            <slot></slot>
            <div class="commit-one" ref="commit" v-for="item in commitList" :key="item.commit_id"> 
               <!-- 评论用户相关信息 -->
                <el-row type="flex" style="align-items: center;">
                    <!-- 头像 -->
                    <el-col :span="3">
                        <div class="grid-content">
                            <img :src="item.user_photo" alt="头像" class="avater" fit="cover">
                        </div>
                    </el-col>
                    
                    <el-col :span="20">
                        <div class="grid-content">
                            <!-- 用户名 发表日期-->
                            <el-row>
                                <el-col :span="18">
                                    <div class="grid-content"  style="float: left;">
                                        <span>{{item.user_name}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="grid-content" style="float: right;">
                                        <span>{{item.commit_date}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- 评分 -->
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content"  style="float: left;">
                                        <el-rate
                                        v-model="value"
                                        disabled
                                        show-score
                                        text-color="#ff9900"
                                        score-template="{value}">
                                        </el-rate>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
                <!-- 评论用户相关信息 -->
                <!-- 评论详细内容 -->
                <el-row>
                    <el-col :span="21" :offset="3" style="text-align: left;">
                        <div class="grid-content">
                            <span>{{item.commit_text}}</span>
                        </div>
                    </el-col>
                </el-row>
                <!-- 点赞 回复按钮 -->
                <el-row>
                    <el-col :span="24" style="text-align: right;">
                        <div class="grid-content">
                            <el-button icon="el-icon-search" circle></el-button>
                            <el-button icon="el-icon-search" circle></el-button>
                        </div>
                    </el-col>
                </el-row>
                <!-- /评论详细内容 -->
            </div>
        </el-main>
    </el-container>
</template>
<script>
export default {
	name: 'CommitBox',
    data(){
        return {
            UserList:[],
            commitList:[],
            textarea:'',
            value: 4.5,
            isSubmit: false,
        };
    },
    created(){
        var that = this
        /* 获取评论列表 */
        that.$http.get('commit/book?book_id='+that.$route.query.book_id).then(res=>{
            that.commitList = res.data.data
        }).catch(err=>{
            console.log(err)
        })
    },
    watch:{
        /* 监听commitList的改变 */
        commitList:{
            handler: function(to){
                this.commitList = to
            },
            deep: true
        }
    },
    methods:{
        /* 发表评论 */
        submitCommit: function(){
            var that = this
            that.isSubmit = true
            if(that.$store.getters.User){
                let commit_time = that.formatTime()
                // /* 提交评论请求 */
                that.$http.post('/commit/submit',{
                    commit_text: that.textarea,
                    book_id: that.$route.query.book_id,
                    user_id: that.$store.getters.User.user_id,
                    commit_date: commit_time
                }).then(function(res){
                    that.isSubmit = false
                    /* 向commitList添加一条新的数据 */
                    that.commitList.unshift({
                        commit_id: res.data.data,
                        commit_date: commit_time,
                        commit_text: that.textarea,
                        user_name: that.$store.getters.User.user_name,
                        user_photo: that.$store.getters.User.user_photo
                    })
                    alert(res.data.msg)
                }).catch(function(err){
                    that.isSubmit = false
                    console.log(err)
                }) 
            }else{
                that.isSubmit = false
                alert("请先登录！")
            }
            
        },
        /* 日期格式化 */
        formatTime(){
            let date = new Date()
            let y = date.getFullYear()
            let m = date.getMonth()+1
            let d = date.getDate()
            let h = date.getHours()
            let min = date.getMinutes()
            let s = date.getSeconds()
            return y+'-'+m+'-'+d+' '+h+':'+min+':'+s
        }
    }
}
</script>
<style>
.split{
    width: 100%;
    border-bottom: 2px solid orangered;
}
.commit-one{
    padding: 10px;
    margin: 10px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
/* 头像 */
.avater{
    width: 70px;
    height: 70px;
    border-radius: 90px;
}
</style>