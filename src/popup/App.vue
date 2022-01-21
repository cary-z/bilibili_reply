<template>
  <div class="main_app p-1">
    <ReplyForm v-model:filter="filter"
               @search="onSearch" />
    <ReplyContent :filter="filter"
                  ref="replyContent" />
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
  num: 1, // 限制数量
  mode: false, // 模式（关键词或者正则）
});
const onSearch = () => {
  // 触发子组件搜索
  replyContent.value.getReply();
};
</script>

<style scoped>
.main_app {
  width: 600px;
}
</style>
