<template>
	<el-container>
		<el-header>
			<!-- 分类单 -->
			<el-row>
				<!-- 频道选择 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
						<p>频道</p>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content">
						<el-menu :default-active="activeIndexList[0]"
						class="el-menu-demo" ref='channel'
						mode="horizontal"
						@select="handleSelect">
							<el-menu-item index="1">出版</el-menu-item>
							<el-menu-item index="2">女生</el-menu-item>
							<el-menu-item index="3">男生</el-menu-item>
						</el-menu>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<!-- 类型选择 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
						<p>类型</p>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content">
						<el-menu :default-active="activeIndexList[1]"
						class="el-menu-demo"
						mode="horizontal" ref='category'
						@select="handleSelect">
							<el-menu-item index="1-1" :style="{'display':isShow.pub}">小说</el-menu-item>
							<el-menu-item index="1-2" :style="{'display':isShow.pub}">文化</el-menu-item>
							<el-menu-item index="1-3" :style="{'display':isShow.pub}">现当代随笔</el-menu-item>
							<el-menu-item index="1-4" :style="{'display':isShow.pub}">传记</el-menu-item>
                            <el-menu-item index="2-1" :style="{'display':isShow.girl}">现代言情</el-menu-item>
							<el-menu-item index="2-2" :style="{'display':isShow.girl}">古代言情</el-menu-item>
							<el-menu-item index="2-3" :style="{'display':isShow.girl}">青春校园</el-menu-item>
                            <el-menu-item index="3-1" :style="{'display':isShow.boy}">都市</el-menu-item>
							<el-menu-item index="3-2" :style="{'display':isShow.boy}">历史</el-menu-item>
							<el-menu-item index="3-3" :style="{'display':isShow.boy}">科幻</el-menu-item>
						</el-menu>

						<!-- <el-menu :default-active="activeIndex3"
						class="el-menu-demo" 
						mode="horizontal" ref='girl'
						@select="handleSelect">
							
							
						</el-menu>

						<el-menu :default-active="activeIndex4"
						class="el-menu-demo" :style="{'display':isShow.boy}"
						mode="horizontal" ref='boy'
						@select="handleSelect">
							
						</el-menu> -->
					</div>
				</el-col>
			</el-row>
			<el-row>
				<!-- 其他选择 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
						<p>其他</p>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content">
						<el-menu :default-active="activeIndexList[2]"
						class="el-menu-demo" ref='status'
						mode="horizontal"
						@select="handleSelect">
							<el-menu-item index="31">全部</el-menu-item>
							<el-menu-item index="32">完结</el-menu-item>
							<el-menu-item index="33">连载</el-menu-item>
							<el-menu-item index="34">新书</el-menu-item>
						</el-menu>
					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			<TypeContent :msg="selectItem"></TypeContent>
			<h1>this is bookTypes</h1>
		</el-main>
	</el-container>
</template>

<script>
import TypeContent from "@/components/TypeContent.vue";
	export default {
		name: 'bookTypes',
		components: {
            TypeContent,
			// HelloWorld
		},
		data() {
			return{
				activeIndexList: ['1','1-1','31'],
				isShow: {
					'pub': 'block',
					'girl': 'none',
					'boy': 'none'
                    },
				selectItem:{
					'channel': '',
					'category': '',
					'book_status': '',
				},
				categoryList: [],
				channelList: [],
				// categoryList: [
				// 	{'出版':['小说','文化','现当代随笔','传记']},
				// 	{'女生':['现代言情','古代言情','幻想言情','青春校园']},
				// 	{'男生':['都市','历史','科幻']},
				// 	{'其他':['新书','完结','连载']},
				// ],
				bookList:[]
			}
        },
        created(){
            this.selectItem = {'channel': '出版', 'category': '小说', 'book_status': '全部' }
        },
		mounted(){
            
        },
        computed:{
           
        },
		watch:{
            // 测试handlerSelecte 结果
            selectItem: {
                 handler:function (to) {
                    console.log('to:'+to.channel)
                },
                deep:true
            },

		},
		methods: {
			// elmenu 选择回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据
			handleSelect: function (key) {
				var that = this
				// 点击控制类型栏显示隐藏 和保存改变后的查询条件
				switch ( key ) {
					case '1':
						// 更改显示隐藏样式
						that.isShow.girl = 'none'
						that.isShow.boy = 'none'
						that.isShow.pub = 'block'
						// 默认选中类型第一个
						that.$refs.category.activeIndex = '1-1'
						// 更新选中选项集合 准备重新渲染页面内容
						that.selectItem.channel = '出版'
						that.selectItem.category = '小说'
						// console.log(this.selectItem)
						break;
					case '2':
						that.isShow.pub = 'none'
						that.isShow.boy = 'none'
						that.isShow.girl = 'block'
                        that.$refs.category.activeIndex = '2-1'
						that.selectItem.channel = '女生'
                        that.selectItem.category = '现代言情'
                        console.log(that.selectItem.category)
						break;
					case '3':
						that.isShow.pub = 'none'
						that.isShow.girl = 'none'
						that.isShow.boy = 'block'
						that.$refs.category.activeIndex = '3-1'
						that.selectItem.channel = '男生'
						that.selectItem.category = '都市'
                        break;
                    case '1-1':
                        //  以下均 ：改变向子组件传递的参数 便于根据最新条件重新发起请求
						that.selectItem.category = '小说'
						break;
					case '1-2':
                        that.selectItem.category = '文化'
						break;
					case '1-3':
						that.selectItem.category = '现当代随笔'
						break;
					case '1-4':
						that.selectItem.category = '传记'
						break;
					case '2-1':
						that.selectItem.category = '现代言情'
						break;
					case '2-2':
						that.selectItem.category = '古代言情'
						break;
					case '2-3':
						that.selectItem.category = '青春校园'
						break;
					case '3-1':
						that.selectItem.category = '都市'
						break;
					case '3-2':
						that.selectItem.category = '历史'
						break;
					case '3-3':
                        that.selectItem.category = '科幻'
                        break;
					case '31':
						that.selectItem.book_status = '全部'
                        break;
                    case '32':
						that.selectItem.book_status = '完结'
                        break;
                    case '33':
						that.selectItem.book_status = '连载'
                        break;
                    case '34':
						that.selectItem.book_status = '新书'
						break;
					default:
						break;
                }
                // return selectItem.category
			},			
		}
	}
</script>

<style scoped>
a{
	text-decoration: none;
	color: black
}
.el-header{
	height: max-content!important;
}
.el-menu--horizontal>.el-menu-item{
	height: 50px;
	line-height: 50px;
}
.el-menu--horizontal>.el-menu-item.is-active{
	/* background-color: brown; */
    /* border: 1px solid #ffffff; */
    border-radius: 20px;
}
</style>
