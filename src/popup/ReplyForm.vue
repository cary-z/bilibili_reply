<template>
  <div>
    <el-form label-position="left">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="BV号">
            <el-input placeholder="请输入BV号"
                      v-model="props.filter.bvid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="uid">
            <el-input placeholder="请输入uid"
                      v-model="props.filter.uid"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item :label="props.filter.mode?'正则表达式':'关键词'">
            <el-input :placeholder="'请输入'+(props.filter.mode?'正则表达式':'关键词')"
                      v-model="props.filter.keyword"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-switch v-model="props.filter.mode"
                     size="large"
                     active-text="正则模式" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="数量">
            <el-input placeholder="请输入数量"
                      v-model="props.filter.num"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary"
               @click="onSearch">搜索</el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
interface IProps {
  filter: {
    bvid: string;
    keyword: string;
    uid: string;
    num: number;
    mode: boolean;
  };
}
const props = defineProps<IProps>();
const emit = defineEmits(["search"]);
const onSearch = () => emit("search");
</script>
<style scoped>
/* .el-col {
  display: flex;
  align-items: center;
} */
</style>
