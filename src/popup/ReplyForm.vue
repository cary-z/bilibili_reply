<template>
  <div>
    <el-form label-position="left">
      <el-form-item label="BV号">
        <el-input placeholder="请输入BV号"
                  v-model="props.filter.bvid"></el-input>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input placeholder="请输入关键词"
                  v-model="props.filter.keyword"></el-input>
      </el-form-item>
      <el-form-item label="uid">
        <el-input placeholder="请输入uid"
                  v-model="props.filter.uid"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary"
               @click="onSearch">搜索</el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
interface IProps {
  filter: {
    bvid: string;
    keyword: string;
    uid: string;
  };
}
const props = defineProps<IProps>();
const emit = defineEmits(["search"]);
const onSearch = () => emit("search");
</script>
<style scoped>
</style>
