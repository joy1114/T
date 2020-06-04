<template>
    <form action="/">
        <van-search
        v-model="value"
        shape="round"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        >
        </van-search>
    </form>
</template>
<script>
import Toast from 'vant'
export default {
  data() {
    return {
      value: ''
    };
  },
  methods: {
    onSearch(val) {
      Toast(val);
    },
  }
}
</script>