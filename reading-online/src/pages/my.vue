<template>

    <div>
        <!-- 导航条 -->
        <div class="my-nav">
            <div class="my-nav-bar">
                <van-nav-bar
                left-text="个人中心"
                left-arrow
                @click-left="backStep"
                >
                 <van-icon :name="menuIcon" size="26" slot="right" @click="showMenu" />
                </van-nav-bar>
            </div>
            <!-- 弹出导航菜单 -->
            <Menu :msg="show"></Menu>
		</div>
        <!-- 个人信息 -->
        <div class="my-info">
            <!-- 用户头像名字及个签等信息 -->
            <van-row gutter="10" type="flex" justify="space-around" class="user-info">
                <van-col span="6" offset="1">
                    <van-image
                    round
                    width="5rem"
                    height="5rem"
                    fit="cover"
                    src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                </van-col>
                <van-col span="16">
                    <van-row>
                        <van-col span="24">
                            <h4 style="margin: 5px auto;">{{user.user_name}}</h4>
                        </van-col>
                    </van-row>
                    <van-row>
                        <van-col span="24">
                            <span v-if="user.user_tips">{{user.user_tips}}</span>
                            <span v-else>快来定制你的个性签名吧~</span>
                        </van-col>
                    </van-row>
                </van-col>
            </van-row>                        
        </div>
        <!-- 书籍 评论数量 -->
        <div class="my-number">
            <van-row type="flex" justify="space-around">
                <van-col span="8" class="right-border"
                @click="goShelf('myShelf')"
                >
                    <h2 v-if="shelfBook.length">{{shelfBook.length}}</h2>
                    <h2 v-else>0</h2>
                    <span>我的书籍</span>
                </van-col>
                <van-col span="8" class="right-border"
                @click="goComment">
                    <h2 v-if="commentList.length">{{commentList.length}}</h2>
                    <h2 v-else>0</h2>
                    <span>我的评价</span>
                </van-col>
                <van-col span="8"
                @click="goShelf('latelyRead')">
                    <h2 v-if="latelyReadCount">{{latelyReadCount}}</h2>
                    <h2 v-else>0</h2>
                    <span>最近阅读</span>
                </van-col>
            </van-row>
        </div>
        <div class="my-options">
            <van-cell title="消息中心" icon="chat" is-link to="/我的" />
            <van-cell title="我的账户" icon="card" is-link url="/我的" />
            <van-cell title="设置" icon="setting" is-link to="/我的" />
        </div>
        <van-row type="flex" justify="space-around">
            <van-col span="23">
                <van-button block plain color="#7232dd" @click="loginOut">
                退出登录
                </van-button>
            </van-col>
        </van-row>
        
    </div>
	
</template>
<script>
import Menu from '../components/menu.vue'
export default {
    name: 'My',
    components:{
        Menu,
    },
    data() {
      return {
        show: false,
        menuIcon: 'wap-nav',
        user: [],
        commentList:[],
        latelyReadCount: Number,
      };
    },
    computed: {
        latelyread:function(){
            return this.$store.getters.userLatelyReadArray()
        },
        shelfBook:function(){
            return this.$store.getters.userShelfArray()
        },
    },
    watch: {
    },
    created(){
        /*用户信息 */
        this.user = this.$store.getters.User
        this.latelyReadCount = this.latelyread[0].length
        console.log(this.latelyReadCount)
        /* 请求评论列表 */
        this.$http.get('comment/user?user_id='+this.$store.getters.User.user_id)
        .then( res => {
            if(res.data.state == 200){
                this.commentList = res.data.data
            }
        }).catch( err => {
            console.log(err)
        })
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
			let from = arr[arr.length-2]
			let history = ''
			arr.splice((arr.length)-2,2)
			arr.map((item) => history=history+ ','+item )
			sessionStorage.setItem('history',history)
			this.$router.push({
				path: from
			})
        },
        goShelf(name){
            this.$router.push('/书架/'+name)
        },
        goComment(){
            this.$router.push('/我的评论')
        },
        // 自定义上传钩子
        uploadImg(param){
            var that = this
            /* formData 文件格式上传 */
            let file = param.file
            let formData = new FormData()
            formData.append('chunk',file)
            formData.append('filename',that.formatFilename(file.name).filename)
            formData.append('userid',that.user.user_id)

            //通过POST方式发送FormData格式的参数 的写法  
            that.$http({
            url: '/user/photo',//请求路径（接口）
            method: 'POST',//请求方式
            headers: { 'content-type': 'application/x-www-form-urlencoded' },// 请求头，发送FormData格式的数据，必须是 这种请求头
            data: formData,//发送请求要传的FormData参数
            }).then(res =>{
                if(res.data.state === 0){
                    that.user.user_photo = res.data.url
                    this.$store.dispatch('uploadPhoto',res.data.url)
                }
                that.$message({
                    message: res.data.msg,
                    type: 'success'
                })
            }).catch(err =>{
                console.log(err)
            })
        },
        /* 上传之前 头像限制图像大小 */
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M
        }, 
        // 使服务器文件名存储唯一
        formatFilename: function(filename){
            console.log(filename)
            let dotIndex = filename.lastIndexOf('.')
            let name = filename.substring(0,dotIndex)
            let suffix = filename.substring(dotIndex+1)
            let date = new Date()
            /* md5加密 */
            name = this.$md5(name) + date.getTime()
            console.log(name)
            return {
                hash: name,
                // name: name,
                suffix,
                filename: `${name}.${suffix}`
            }
        },
        /* 退出登录 */
        loginOut: function () {
            var that = this
            that.$store.dispatch('LoginOut')
            /* 重定向到首页 */
            that.$router.push({
                path: that.$route.query.redirect || "/首页"
            })
            // that.$confirm('此操作将退出账户, 是否继续?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     that.$store.dispatch('LoginOut')
            //     that.$message({
            //         type: 'success',
            //         message: '退出成功!'
            //     })
            //     /* 重定向到首页 */
            //     that.$router.push({
            //         path: that.$route.query.redirect || "/home"
            //     })
            // }).catch(() => {
            //     that.$message({
            //     type: 'info',
            //     message: '已取消退出'
            //     })        
            // })			
        },
    },
}
</script>
<style>
.my-info>.user-info,.my-options{
    text-align: left;
}
.my-info{
    padding-top: 1em;
    padding-bottom: 0.6em;
}
.my-info>.user-info{
    align-items: center;
    
}
.my-options{
    margin: 10px auto;
    border: 1px solid #ebedf0
}
.my-number{
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
}
.my-number .right-border{
    border-right: 0.1em solid #ebedf0
}
.my-number h2{
    display: block;
    font-size: 1.5em;
    margin-block-start: 0em;
    margin-block-end: 0em;
}
</style>