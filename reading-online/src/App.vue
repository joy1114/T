<template>
  <div id="app">
		<router-view/>
	</div>
</template>
<script>
	// import MyFooter from '@/components/FooterInfo.vue'
export default {
	name: 'app',
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
</style>
