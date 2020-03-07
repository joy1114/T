<template>
	<div class="home">
		<Carousel></Carousel>
		<TypesBox></TypesBox>
	</div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import Nav from "../components/Nav.vue";
// import FooterInfo from "../components/FooterInfo.vue";
import Carousel from "../components/Carousel.vue";
import TypesBox from "../components/TypesBox.vue";
export default {
  name: 'Home',
  components: {
		TypesBox,
		Carousel,
  }
}
</script>
<style scoped lang="scss">
	* {
	margin: 0;
	padding: 0;
	margin-top: 0px;
	}
	a{
	margin: 0;
	}
	/* header与mian内容之间的空隙 */
	// .el-main {
	// margin-top: 10px;
	// // line-height: 0px; /* 卡片切换点的位置 */
	// overflow: hidden;
	// }
</style>
