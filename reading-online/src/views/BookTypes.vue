<template>
	<el-container>
		<el-header>
			<!-- 分类单 -->

			<el-row :gutter="10" justfy="center">
				<!-- 选项栏名称 -->
				<el-col :span="4" :offset="4">
					<div class="grid-content">
                        <el-row v-for="(title,index1) in titleList" :key="index1">
                            <el-col :span="4">
                                <div class="grid-content">
                                    <p>{{title}}</p>
                                </div>
                            </el-col>
                        </el-row>
					</div>
				</el-col>
                <!-- /选项栏名称 -->

                <!-- 具体选项区域 -->
				<el-col :span="16">
					<div class="grid-content">
                         <!-- 频道选项菜单 -->
                        <el-row>
                            <el-col :span="16">
                                <div class="grid-content"  v-if="channelList[0]">
                                    <el-menu :default-active="channelList[0].channel_name"
                                    class="el-menu-demo" ref='channel'
                                    mode="horizontal"
                                    @select="channelSelect">
                                        <el-menu-item :index="channel.channel_name"
                                        v-for="channel in channelList"
                                        :key="channel.channel_id">{{channel.channel_name}}</el-menu-item>
                                    </el-menu>
                                </div>
                            </el-col>
                        </el-row>
                         <!-- /频道选项菜单 -->

                        <!-- 类型选项菜单 -->
                        <el-row>
                            <el-col :span="16">
                                <div class="grid-content"  v-if="categoryList[0]">
                                    <el-menu :default-active="categoryList[index2][0].category_name"
                                    class="el-menu-demo"
                                    mode="horizontal" ref='category'
									:style="{'display': isShow[channelList[index2].channel_name]}"
                                    v-for="(item,index2) in channelList.length" :key="index2"
                                    @select="categorySelect">
                                        <el-menu-item :index="category.category_name"
                                        v-for="category in categoryList[item-1]"
										:key="category.category_id">{{category.category_name}}</el-menu-item>
                                    </el-menu>
                                </div>
                            </el-col>
                        </el-row>
                        <!-- /类型选项菜单 -->

                         <!-- 其他选项菜单 -->
                        <el-row>
                            <el-col :span="16">
                                <div class="grid-content">
                                    <el-menu :default-active="(statusList[0].status_name)"
                                    class="el-menu-demo" ref='status'
                                    mode="horizontal"
                                    @select="statusSelect">
                                        <el-menu-item :index="other.status_name"
										v-for="(other,index3) in statusList"
										:key="index3">{{other.status_name}}</el-menu-item>
                                    </el-menu>
                                </div>
                            </el-col>
                        </el-row>
                         <!-- /其他选项菜单 -->

					</div>
				</el-col>
                <!-- /具体选项区域 -->

			</el-row>
		</el-header>
		<el-main>
            <!-- 子组件 向其传递的参数msg 用来动态显示查询的书籍清单-->
			<TypeContent :msg="selectItem"></TypeContent>
			<!-- <h1>this is bookTypes</h1> -->
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
                // 选项栏标题
                titleList:['频道','类型','其他',],
                // 类型 、频道、书籍 清单
				channelList: [],
				categoryList: [],
				// 其他选项栏选项
				statusList:[
					{
						'status_id': 0,
						'status_name': '全部'
					}
				],
				bookList:[],
				// 控制 类型 选项栏随频道选项的选择改变显示隐藏样式
				isShow: [],
                // 当前每一栏的选中项 
				selectItem:{
					'channel': '',
					'category': '',
					'status': '',
                },
			}
        },
        created(){
			var that =this
			that.init()
			

        },
		mounted(){
            
        },
		// computed: {
		// 	channelListobj: {
		// 		get: function(){
		// 			return this.channelList; // 在这里把临时对象的值通过计算属性赋值给页面中用到的对象
		// 		}
		// 	},
		// },
		watch:{
            // 监听selectItem 的channel属性   调整分类栏显示/隐藏相应二级分类菜单
            'selectItem.channel': {
                 handler:function (to,from) {
					// var that = this
					this.isShow[from] = 'none'
					this.isShow[to] = 'table'
					// console.log('to:'+to+',from:'+from)
                }
			},

		},
		methods: {
			/* data 数据初始化 */
			init: async function(){
				var that = this
				await that.common.getChannel(that._self)
				await that.common.getCategory(that._self)
				await that.common.getStatus(that._self)
				// console.log(that.$route.query)
				if (!that.$route.query.category) {
					// 默认是每一栏的第一个选项
					that.selectItem.channel = that.channelList[0].channel_name
					that.selectItem.category = that.categoryList[0][0].category_name
				}else{
					// 判断路由是否传参  是否是首页分类连接的跳转
					that.$set(that.selectItem,'channel',that.$route.query.channel)
					that.$set(that.selectItem,'category',that.$route.query.category)
					let channelObj = that.channelList.filter( 
						item => item.channel_name === that.selectItem.channel
						)
					// 视图上选中 相应二级分类栏 的选项
					that.$refs.category[channelObj[0].channel_id-1].activeIndex = that.selectItem.category
				}
				// console.log(that.selectItem)
				// 默认其他栏选项为‘全部’
				that.selectItem.status = that.statusList[0].status_name
				/* 初始化 isShow */
				for (let i = 0; i < that.channelList.length; i++) {
					if ( i===0 ) {
						that.$set(that.isShow,that.channelList[i].channel_name,'table')
					} else{
						that.$set(that.isShow,that.channelList[i].channel_name,'none')
					}
				}
				/* ----初始化 isShow---- */
			},
			/* ----data 数据初始化----- */
			
			/* channel elmenu 的选择 回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据 */
			channelSelect: function (key) {
				var that = this
				// 点击控制类型栏显示隐藏 和保存改变后的查询条件
				that.selectItem.channel = key
				// 从频道列表筛选出名称为 key的对象 便于获得key的 id ，以id获取分类列表相应频道的对象数组
				let channelObj = that.channelList.filter( item => item.channel_name === key)
				// 将类型选中的选项设为 key对应类型的第一个名称值
				that.selectItem.category = that.categoryList[(channelObj[0].channel_id)-1][0].category_name
				// 视图上默认选中 相应二级分类栏 第一个选项
				that.$refs.category[channelObj[0].channel_id-1].activeIndex = that.selectItem.category
			},
			/* ---channel elmenu 的选择 回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据--- */
			
			/* category elmenu 选择回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据 */
			categorySelect: function (key) {
				var that = this
				// 点击控制类型栏显示隐藏 和保存改变后的查询条件
				that.selectItem.category = key
			},
			/* ---category elmenu 选择回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据--- */
			
			/* status elmenu 选择回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据 */
			statusSelect: function (key) {
				var that = this
				// 点击控制类型栏显示隐藏 和保存改变后的查询条件
				that.selectItem.status = key
			},
			/* ---status elmenu 选择回调处理函数  匹配选中项 使之高亮 更新查询条件组合数据--- */
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
