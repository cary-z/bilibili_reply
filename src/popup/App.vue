<template>
  <div class="main_app">
    <reply-form v-model:filter="filter"
                @search="onSearch"></reply-form>
    <reply-content :filter="filter"
                   ref="replyContent"></reply-content>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ReplyForm from "./ReplyForm.vue";
import ReplyContent from "./ReplyContent.vue";
const replyContent = ref<any>(null);
const filter = ref({
  // 查询条件
  bvid: "", // BV号
  keyword: "", // 关键词
  uid: "", // b站用户id
});
const onSearch = () => {
  // 触发子组件搜索
  replyContent.value.getReply();
};
</script>

<style scoped>
.main_app {
  width: 500px;
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
}
</style>
