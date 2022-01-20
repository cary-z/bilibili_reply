<template>
  <div>
    <div>{{matchInfo}}</div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose } from "vue";
import { IProps } from "./type";
import { getAid, getReplyInfo } from "../api/reply";
const props = defineProps<IProps>();
const getReply = async () => {
  // console.log(props.filter.keyword, props.filter.uid);
  const aid = await getAid(props.filter.bvid);
  getReplyInfo({ oid: aid });
};
const matchInfo = await getReply();
defineExpose({ getReply });
</script>
<style scoped>
</style>
