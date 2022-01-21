<template>
  <div class="main_app p-1">
    <ReplyForm v-model:filter="filter"
               :view="view"
               @search="onSearch"
               @stop="onStop" />
    <ReplyContent :filter="filter"
                  :view="view"
                  ref="replyContent" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { IView } from "./useinfo";
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
const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0,
});
const onSearch = () => {
  // 触发子组件搜索
  replyContent.value.getReply();
};
const onStop = () => {
  // 触发子组件停止搜索
  replyContent.value.stopGetReply();
};
</script>

<style scoped>
.main_app {
  width: 600px;
}
</style>
