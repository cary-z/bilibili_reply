<template>
  <div>
    <div>{{view.reply_cur}}/{{view.reply_total}}</div>
    <div>{{matchInfo}}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineExpose } from "vue";
import { search, IView } from "./useinfo";
interface IProps {
  filter: {
    bvid: string;
    keyword: string;
    uid: string;
  };
}
const props = defineProps<IProps>();
const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0,
});
const matchInfo = ref<any>("");
const clear = () => {
  view.value.flag = true;
  view.value.reply_cur = 0;
  view.value.reply_total = 0;
};
const getReply = async () => {
  clear();
  const { bvid, keyword, uid } = props.filter;
  const regexp = `/${keyword}/g`;
  matchInfo.value = await search({ bvid, uid, regexp }, view.value);
};
defineExpose({ getReply });
</script>
<style scoped>
</style>
