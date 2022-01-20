<template>
  <div>
    <div>{{matchInfo}}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineExpose } from "vue";
interface IProps {
  filter: {
    bvid: string;
    keyword: string;
    uid: string;
  };
}
import { getAid, getReplyInfo } from "../api/api_base";
const props = defineProps<IProps>();
const matchInfo = ref<any>("");
const getReply = async () => {
  const aid = await getAid(props.filter.bvid);
  matchInfo.value = await getReplyInfo({ oid: aid });
};
defineExpose({ getReply });
</script>
<style scoped>
</style>
