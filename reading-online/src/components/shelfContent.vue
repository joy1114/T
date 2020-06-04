<template>
    <div class="shelf-content">
      <!-- 排序方式 编辑 -->
      <van-sticky>
      <div class="sort-options">
        <van-cell v-if="isEdit">
          <van-row class="select-bar" type="flex" justify="space-between">
            <van-col class="all-select" span="8">
              <div>
                  <van-checkbox
                  v-model="allCheck"
                  checked-color="#f75000"
                  @click="checkedAllItem">全选</van-checkbox>
                </div>
            </van-col>
            <van-col class="total-book" span="8">
              <div>
                <span>共</span><span>{{Books.length}}</span><span>本</span>
              </div>
            </van-col>
            <van-col class="edit-btn" span="8">
              <div class="btn">
                <span @click="cancelEdit" >取消</span>
              </div>
            </van-col>
          </van-row>
        </van-cell>

        <van-nav-bar
        v-if="sortBar"
        right-text="编辑"
        left-down
        @click-left="onClickTime"
        @click-right="onClickEdit"
        >
          <div class="options" slot="left">
            <span>{{sortTimeName}}</span>
            <van-icon name="ascending" size="20"></van-icon>
          </div>
        </van-nav-bar>
        <!-- 排序方式选项菜单 -->
        <van-action-sheet v-model="isSortTime" :actions="actions" @select="onSelect" />
          
      </div>
      </van-sticky>
      <!-- 删除按钮 -->
      <van-tabbar v-show="showDeletebtn">
          <van-button block color="#f75000" plain @click="deleteBook">删除</van-button>
      </van-tabbar>
      <!-- 书 list -->
      <div class="shelf">

        <div class="book-items">

          <van-row type="flex"
          justify="space-around"
          class="book-card"
          v-for="(item,index) in Books"
          :key="item.book_id"
          @click="item.book_readStatus==='立即阅读'?toBookInfo(item.book_id,item.book_name):toReadPage(readedId['id'+item.book_id.toString()]-1,item.book_id)">
            <!-- 单选框 -->
            <van-col v-if="isEdit" span="3">
              <van-checkbox
              v-model="isCheckedArr[index]"
              :name="index"
              checked-color="#f75000"
              @change="changeCheck()"></van-checkbox>
            </van-col>
            <!-- 图 -->
            <van-col span="5">
              <van-image :src="item.images">
                <template v-slot:loading>
                <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </van-col>
            <!-- 名字 作者 章 -->
            <van-col class="item-content" :span="itemWidth">
              <van-cell
              ref="readStatus"
              class="book-name-cell"
              :title="item.book_name"
              :value="item.book_readStatus"
              center
              is-link/>
              <!-- 作者 -->
              <van-cell class="author">
                <template slot="title">
                  <div >
                    <van-icon name="manager" size="middle">{{item.author}}</van-icon>
                  </div>
                </template>
                <!-- 最近阅读章节 -->
                <template slot="default">
                  <div class="title-ellipsis">
                    <span>{{latelyReadChapter[index]}}</span>
                  </div>
                  <!-- <div v-else>
                    <span>未阅读</span>
                  </div> -->
                </template>
              </van-cell>
              
              <!-- 最近更新 -->
              <van-cell
              
              class="updatetime"
              :value="timeIntervals[index]">
                <template slot="title">
                  <div class="title-ellipsis" @click="toReadPage(itemtitleArr[index].length-1,item.book_id)">
                    <span>更新至</span>
                    <span>{{latelyUpdateChapter[index]}}</span>
                  </div>
                </template>
              </van-cell>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  name: 'ShelfContent',
  data() {
    return {
      activeButton: '',
      showMyShelf: true,
      isSortTime: false,
      sortTimeName: '阅读时间',
      actions: [
        { name: '阅读时间',color: '#f75000' },
        { name: '更新时间',color: '#000000' }
      ],
      isEdit: false,
      sortBar: true,
      itemWidth: 18,
      Books: [],
      noBook:false,
      readedId: [],
      latelyUpdateChapter: [],
      latelyReadChapter: [],
      itemtitleArr: [[]],
      timeIntervals: [],
      isCheckedArr: [],
      allCheck: false,
      showDeletebtn: false,
      selectedId: [],
    };
  },
  props:{
    msg: String
  },
  computed: {
      latelyRead:function(){
          return this.$store.getters.userLatelyReadArray()
      },
      /* 获取书架书籍 list */
      shelfBook:function(){
          return this.$store.getters.userShelfArray()
      },
      user: function(){
        return this.$store.getters.User
      }
  },
  watch:{
    msg(to){
      this.activeButton = to
      this.init()
      
    },
    showDeletebtn:function(to){
      this.showDeletebtn = to
    }
  },
  created(){
    this.activeButton = this.msg
    this.init()
  },
  methods: {
    init(){
      if(this.activeButton === 'myShelf'){
        this.showMyShelf = true
        this.sortBar = true
        this.readedId = this.getEqualBookid()
        this.shelfBook.length?this.getBooks(this.shelfBook):this.noBook = true
      }else{
        this.showMyShelf = false
        this.sortBar = false
        let latelyids = this.getLatelyBook()
        this.latelyRead[0].map((item,index) => {
          this.readedId['id'+item.toString()] = this.latelyRead[1][index]
        })
        latelyids.length?this.getBooks(latelyids):this.noBook = true
      }
    },
    /* 展开 、关闭排序选项菜单 */
    onClickTime(){
      this.isSortTime = true
    },
    /* 点击排序时间的选项 */
    onSelect(item,index) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      let anothorAction = index === 0?1:0
      // if(anothorAction == 1){
        
      // }
      this.actions[anothorAction].color = '#000000'
      item.color = '#f75000'
      this.isSortTime = false;
      this.sortTimeName = item.name
    },
    /* 编辑书籍 */
    onClickEdit(){
       console.log('time')
       this.isEdit = true
       this.sortBar = false
       this.itemWidth = 15
    },
    checkedAllItem(){
      if(this.allCheck === false){
        for(let i = 0; i<this.isCheckedArr.length; i++){
          this.isCheckedArr[i] = true
        }
        this.showDeletebtn = true
      }else{
        for(let j = 0; j<this.isCheckedArr.length; j++){
          this.isCheckedArr[j] = false
        }
        this.showDeletebtn = false
      }
    },
    /* 单选框状态改变时 */
    changeCheck(){
      let arr = this.isCheckedArr.filter(item => item === true)
      
      this.allCheck = arr.length === this.isCheckedArr.length?true:false
      this.showDeletebtn = (this.isCheckedArr.indexOf(true))===-1?false:true
      console.log(this.showDeletebtn)
    },
    cancelEdit(){
      this.isEdit = false
      this.sortBar = true
      this.itemWidth = 18
      this.showDeletebtn = false
      this.isCheckedArr.map((item,index) => {
        this.isCheckedArr[index] = false
      })
    },
    deleteBook(){
      let deletedids = []
      let i =0
      /* 选中的 用户id，书籍id */
      this.isCheckedArr.filter((item,index) => {
        if(item === true){
          this.Books[index].isDel = true
          this.selectedId.push([this.user.user_id,this.Books[index].book_id])
          deletedids[i] = this.Books[index].book_id
          i++
        }
      })
      /* 视图更新 */
      for (let i = this.Books.length - 1; i >= 0; i--) {
        if (this.Books[i].isDel) {
            this.Books.splice(i,1);
            this.isCheckedArr.splice(i,1)
            this.allCheck = false
        }
      }
      /* 删除书架表用户书籍相关数据 */
      this.$http.post('/user/deleteShelf',{
        dataids: this.selectedId
      }).then(res => {
        if(res.data.state === 200){
          this.$store.dispatch('DeleteShelfBook',deletedids)
          Toast.success('删除成功！')
        }else{
          Toast.fail('出错了')
        }
      }).catch(err =>{
        console.log(err)
      })
      // 减少相关书籍被收藏数量 reducecollectnum
      this.$http.post('/book/reducecollectnum',{
        dataids: deletedids
      })
    },
    /* 获取最近阅读书籍 list */
    getLatelyBook(){
      let latelyids = []
      latelyids = this.latelyRead[0]
      return latelyids
    },
    /* 书架中阅读过的书籍 */
    getEqualBookid(){
      var that = this
      let latelyReadindex = 0
      let latelytitle = []
      that.shelfBook.map((item) => {
        latelyReadindex = that.latelyRead[0].indexOf(item)
       if(latelyReadindex != -1){
         latelytitle['id'+item.toString()] = that.latelyRead[1][latelyReadindex]
       }else{
         latelytitle['id'+item.toString()] = -1
       }
      })
      console.log(latelytitle)
      return latelytitle
    },
    getBooks(ids){
      var that = this
       that.$http.post('/book/shelf',{
          book_ids: ids
        }).then(res => {
            if(res.data.state == 200){
                that.Books = res.data.data
                that.Books.map((item,index) => {
                  that.itemtitleArr[index] = item.titles.split('-')
                  that.latelyUpdateChapter[index] = that.itemtitleArr[index][(that.itemtitleArr[index].length)-1]
                  if(that.latelyRead[0].indexOf(item.book_id) >=0){
                    that.$set( that.Books[index],"book_readStatus","继续阅读")
                    that.latelyReadChapter[index] = '读至'+that.itemtitleArr[index][that.readedId['id'+item.book_id.toString()]-1]
                  }
                  else{
                    that.$set( that.Books[index],"book_readStatus","立即阅读")
                    that.latelyReadChapter[index] = '未阅读'
                  }
                  that.timeIntervals[index] = that.$common.intervalsTime(item.update_time)
                  that.isCheckedArr[index] = false
                  item['isDel'] = false
                })
                
            }else{
              console.log(res.data.err)
            }
        }).catch(err => {
            console.log(err)
        })
    },
    toBookInfo(book_id,book_name){
      console.log('toBookInfo')
      if(!this.isEdit){
        this.$router.push({
          path: '/详情/'+book_id,
          query:{
              book_name: book_name
          }
        })
      }
      
    },
    /* 去最新章节 */
    toReadPage(titleid,bookid){
      console.log('tochapter')
      console.log(titleid)
      var that = this
      if(!this.isEdit){
        that.$router.push({
          path: '/阅读/'+bookid,
          query:{
            title: parseInt(titleid),
          }
        })
      }
      
    }
  }
}
</script>
<style scoped>
.options>span{
    font-size: 13px;
    vertical-align: middle;
  }
.options>>>.van-icon{
  color: #f75000;
}
.sort-options>>>.van-nav-bar__text{
  color: #2c3e50;
}
option-bar{
  align-items: center;
}
.option-bar .select-all{
  text-align: left;
}
.total-book{
  text-align: center;
}
.btn{
  text-align: right;
}
  .book-card{
    text-align: left;
    align-items: center;
    border-top: 1px solid lightgray;
    padding: 10px;
  }
  .book-card>>>.van-checkbox__icon{
    flex: 1;
  }
  .book-card>>>.van-checkbox__icon .van-icon {
    border-radius: 90px;
    margin: 0 auto;
}
.book-card>>>.van-image {
    padding: 2px;
    border: 1px solid rgba(0,0,0,0.2);
    box-shadow:2px 2px 5px #333333;
    -webkit-box-shadow:0px 2px 3px rgba(0,0,0,0.3);
    width: 4rem;
    height: 5.5rem;
}
.book-card .item-content .van-cell{
  padding: 3px 0;
}
.book-card .item-content .van-cell:not(:last-child)::after{
  border: none;
}
.book-card .item-content .book-name-cell>>>.van-cell__title {
    font-size: 1.1rem;
    font-weight: bold;
}
.book-card .item-content .book-name-cell>>>.van-cell__right-icon{
  margin-left: 0px;
}
.book-card .item-content .book-name-cell.van-cell{
  line-height: normal;
}
.book-card .item-content .author,.book-card .item-content .updatetime{
  font-size: 0.8rem;
}
.book-card .item-content .author>>>.van-cell__value,
.book-card .item-content .updatetime>>>.van-cell__title{
  flex-grow: 2.1;
}
.book-card .item-content .updatetime>>>.van-cell__value,
.book-card .item-content .author>>>.van-cell__value {
  margin-right: 6px;
}
.title-ellipsis{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
/* van-tabbar[class*=van-hairline]::after {
    -webkit-transform: none;
    transform: none;
} */
.shelf-content .van-tabbar{
  align-items: center;
  justify-content: center;
}
.shelf-content .van-tabbar .van-button--block {
    width: 95%;
}
</style>