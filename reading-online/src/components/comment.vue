<template>
    <div class="comment">
        <van-cell
        title="评论"
        value="写书评"
        is-link
        @click="writeComment"
        />
        <!-- 输入框 下拉框 -->
        <van-action-sheet :round="false" v-model="showInput" >
            <div class="content">
                <div class="commit-rate">
                    <van-cell>
                        <van-rate
                        v-model="newValue"
                        :count="5"
                        size="1.8rem"
                        void-icon="star"
                        void-color="#eee"
                        @change="changeNewValue" />
                        <div ref="star-grade">
                            点触星星评分
                        </div>
                    </van-cell>
                </div>
                 <!-- 评论输入框 -->
                <van-row type="flex" justify="space-around" align="center">
                    <van-col span="18">
                        <van-field
                        class="input-box"
                        v-model="newComment"
                        rows="2"
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        clearable
                        autosize
                        autofocus
                        placeholder="写评论..."
                        />
                    </van-col>
                    <van-col>
                        <van-button size="small" type="primary" @click="submitComment">发送</van-button>
                    </van-col>
                </van-row>
            </div>
        </van-action-sheet>
        <van-card
        class="comment-item"
        ref="comment" 
        v-for="(item,index) in commentList"
        :key="item.comment_id"
        >
        
        <template #title>
            <van-cell class="comment-user" :title="item.user_name" center :border="false" :value="item.comment_date">
                <template #icon>
                    <van-image
                    round
                    fit="cover"
                    width="2rem"
                    height="2rem"
                    src="https://img.yzcdn.cn/vant/cat.jpeg"
                    >
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                    </van-image>
                </template>
            </van-cell>
        </template>
        <template #desc>
            <div class="comment-desc">
                <van-rate
                class="comment-rate" 
                v-model="item.comment_rate"
                :count="5"
                readonly
                allow-half
                size="0.8rem"
                void-icon="star"
                void-color="#eee" />
                <div class="comment-text">
                    <p :ref="'text-'+index" class="van-multi-ellipsis--l3">{{item.comment_text}}</p>
                    <button v-if="item.isShowMore" class="btn-more" ref="button" type="button" @click="clickCollapse(index)">展开</button>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="footer-icon">
                <van-icon :ref="'likeid'+item.comment_id" name="good-job-o" :color="item.likeColor" size="1.3rem" @click="likeComment(item.comment_id,index)"/>
                <span>{{item.comment_likenum}}</span>
            </div>
            <div class="footer-reply footer-icon">
                <van-icon :ref="'replyid'+item.comment_id" name="chat-o" size="1.3rem" @click="replyComment(item.comment_id,index)"/>
                <span>{{item.comment_replynum}}</span>
            </div>
            
        </template>
        </van-card>
    </div>
</template>
<script>
import { Toast } from 'vant';
export default {
	name: 'commit',
    data(){
        return {
            showInput:false,
            UserList:[],
            commentList:[],
            userLike: [],
            textarea:'',
            newValue: 0,
            newComment: '',
        };
    },
    computed:{
        user: function(){
            console.log(this.$store.getters.User)
            return this.$store.getters.User
        },
        token: function(){
            return this.$store.getters.Token
        }
    },
    created(){
        var that = this
        /* 获取评论列表 */
        that.$http.post("comment/book",{
            book_id: that.$route.params.id,
            user_id: that.user.user_id
        }).then(res=>{
        that.userLike = res.data.data[0]
        let likearr=[]
        that.userLike.map((item,index) => {
            likearr[index] = item.comment_id
        })
        that.commentList = res.data.data[1]
        that.commentList.map((item,index) => {
            /* 评论 折叠初始 */
            if(item.comment_text.length>60){
            that.$set(that.commentList[index],'isCollapse',true)
            that.$set(that.commentList[index],'isShowMore',true)
            }else{
                that.$set(that.commentList[index],'isShowMore',false)
            }
            /* 点赞icon 初始颜色 */
            if(likearr.indexOf(item.comment_id) >=0){
                that.$set(that.commentList[index],'likeColor','rgb(25, 137, 255)')
            }else{
                that.$set(that.commentList[index],'likeColor','rgb(0, 0, 0)')
            }
            /* 评论日期 格式 */
            that.commentList[index].comment_date = that.$common.commentTime(item.comment_date)
        })
        }).catch(err=>{
            console.log(err)
        })
    },
    watch:{
        /* 监听commentList的改变 */
        commentList:{
            handler: function(to){
                this.commentList = to
            },
            deep: true
        }
    },
    methods:{
        /* 写评论 */
        /* 登录提示 */
        loginConfirm(){
            this.$dialog.confirm({
                    title: '提示',
                    message: '登录解锁更多权限, 是否跳转去登陆?'
                }).then(() => {
                // on confirm
                    this.$router.push('/登录')
                }).catch(() => {
                // on cancel
                })
        },
        writeComment(){
            console.log('xie')
            if(!this.token){
               this.loginConfirm()
            }else{
                this.showInput = true
            }
        },
        /* 打分改变 */
        changeNewValue(newvalue){
            switch(newvalue){
                case 1:
                    this.$refs['star-grade'].innerHTML = '很差'
                    break;
                case 2:
                   this.$refs['star-grade'].innerHTML = '较差'
                   break;
                case 3:
                    this.$refs['star-grade'].innerHTML = '还行'
                    break;
                case 4:
                    this.$refs['star-grade'].innerHTML = '推荐'
                    break;
                case 5:
                    this.$refs['star-grade'].innerHTML = '力荐'
                    break;
            }
        },
        /* 点赞 取消点赞 */
        likeComment(commentId,index){
            
            let el = this.$refs['likeid'+commentId]
            console.log(el.style.color)
            /* rgb(x, x, x)  除了第一个‘，’后都要加空格*/
            if(el.style.color === "rgb(0, 0, 0)"){
                if(!this.token){
                    this.loginConfirm()
                }else{
                   // 点赞
                    console.log('点赞')
                    el.style.color = "rgb(25, 137, 255)"
                    this.commentList[index].likeColor = "rgb(25, 137, 255)"
                    this.commentList[index].comment_likenum ++
                    console.log(this.commentList[index].comment_likenum)
                    this.$http.post('/comment/addlike',{
                        user_id: this.user.user_id,
                        comment_id: commentId,
                        comment_likenum: this.commentList[index].comment_likenum,
                    })
                    // .then( res => {
                    //     console.log(res.data)
                    // }).catch(err => {
                    //     console.log(err)
                    // }) 
                }
                
            }else{
                // 取消赞
                el.style.color = "rgb(0, 0, 0)"
                this.commentList[index].likeColor = "rgb(0, 0, 0)"
                this.commentList[index].comment_likenum --
                this.$http.post('/comment/cancellike',{
                    user_id: this.user.user_id,
                    comment_id: commentId,
                    comment_likenum: this.commentList[index].comment_likenum,
                })
            }
            
        },
        replyComment(){

        },
        /* comment限制显示长度 展开 收起 */
        clickCollapse(index){
            let p = this.$refs['text-'+index]
            let btn = this.$refs.button
            p[0].classList[!this.commentList[index].isCollapse ? 'add' : 'remove']('van-multi-ellipsis--l3')
            btn[0].classList[this.commentList[index].isCollapse ? 'add' : 'remove']('more-collapse')
            btn[0].innerHTML = !this.commentList[index].isCollapse ? '展开' : '收起'
            this.commentList[index].isCollapse = !this.commentList[index].isCollapse
        },
        /* 发表评论 */
        submitComment: function(){
            var that = this
            Toast.loading('发送中...')
            let comment_time = that.$common.getNOwTime()
            /* 提交评论请求 */
            that.$http.post('/comment/submit',{
                comment_text: that.newComment,
                book_id: parseInt(that.$route.params.id),
                user_id: that.$store.getters.User.user_id,
                comment_date: comment_time,
                comment_rate: that.newValue,
            }).then(function(res){
                
                /* 向commentList添加一条新的数据 */
                that.commentList.unshift({
                    comment_id: res.data.data,
                    comment_date: that.$common.commentTime(comment_time),
                    comment_text: that.newComment,
                    comment_rate: that.newValue,
                    comment_likenum: 0,
                    comment_replynum: 0,
                    likeColor:'rgb(0, 0, 0)',
                    user_name: that.$store.getters.User.user_name,
                    user_photo: that.$store.getters.User.user_photo
                })
                Toast.clear()
                Toast.success(res.data.msg)
                that.showInput = false
                that.newComment =''
                that.newValue = 0
                that.$refs['star-grade'].innerHTML = "点触星星评分"
                
            }).catch(function(err){
                Toast.clear()
                Toast.fail('出错了')
                console.log(err)
            })
            
        },
    }
}
</script>
<style scoped>
.comment{
    padding-top: 1rem auto;
    background: #fafafa;
}
.comment>>>.van-cell{
    font-size: 1rem;
}
.comment .comment-item{
    background: #fff;
}
.comment .content .commit-rate{
    width: 100%;
    height: auto;
}
.content ,.commit-rate .van-cell .van-cell__value--alone{
    text-align: center;
}
.comment .input-box{
    padding: 0.8rem 0;
}
.comment .input-box>>>.van-field__value{
    padding: 0.3rem 0.5rem;
    border-radius: 0.6em;
}
.comment .input-box>>>.van-field__value,
.comment .comment-item .comment-user,
.comment .comment-item .comment-text,
.comment .comment-item .van-card__header,
.comment .comment-item .van-card__footer{
    background: #fafafa;
}
.comment .comment-item .comment-desc{
    text-align: left;
    padding: 0 16px;
}
.comment .van-cell__title,
.comment .comment-item .comment-user .van-cell__title{
    text-align:  left;
}
.comment .comment-item .comment-user .van-cell__value{
    text-align:  right;
}
.comment .comment-item .van-card__footer{
    padding: 0 16px 10px;
}
.btn-more.more-collapse::after,
.btn-more.more-collapse::before {
	top: 2px;
	transform: rotate(180deg);
}
.btn-more.more-collapse::before {
	top: 4px;
}
.btn-more::after,
.btn-more::before {
	width: 0;
	height: 0;
	content: '';
	position: absolute;
	right: 0;
	top: 7px;
} 
.btn-more::after {
	border-top-color: #5383E7;
	z-index: 1;
}
.btn-more::before {
	border-top-color: #1c2239;
	z-index: 2;
	top: 5px;
}
.btn-more{
	color: #fff;
	float: right;
	color: #5383E7;
	position: relative;
	border: 0;
    top: -1em;
	background: none;
}
.comment-item .footer-icon{
    display: inline-flex;
    text-align: center;
    line-height: 1.3rem;
}
.comment-item .footer-reply{
    margin-left: 2.5em;
}
</style>