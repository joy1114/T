<template>
  <div id="app">
		<router-view/>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
	</div>
</template>

<script>
	// import HelloWorld from '@/components/HelloWorld.vue'
export default {
	name: 'app',
	components: {
		// HelloWorld
	}
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-main{
		overflow: hidden;
	}
/* 删除 */
/* 书籍上下间隔 */
.el-row {
	margin-bottom: 20px;
}

</style>
