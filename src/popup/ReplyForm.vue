<template>
  <div>
    <el-form label-position="left">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="BV号">
            <el-input placeholder="请输入BV号"
                      v-model="filter.bvid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="uid">
            <el-input placeholder="请输入uid"
                      v-model="filter.uid"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item :label="filter.mode?'正则表达式':'关键词'">
            <el-input :placeholder="'请输入'+(filter.mode?'正则表达式':'关键词')"
                      v-model="filter.keyword"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-switch v-model="filter.mode"
                     size="large"
                     active-text="正则模式" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="数量">
            <el-input placeholder="请输入数量(空输入搜索一个，输入*搜索全部)"
                      :model-value="filter.num"
                      @input="limitInput"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <!-- :loading="props.view.flag" -->
      <el-button type="primary"
                 v-loading="view.flag"
                 :disabled="view.flag"
                 @click="getReply">搜索</el-button>
      <el-button type="danger"
                 @click="stopGetReply">停止搜索</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, view, getReply } from "./search";
const stopGetReply = () => {
  view.value.flag = false;
};
const limitInput = (event: string) => {
  if (Number(event) || ["", "*"].includes(event)) {
    filter.value.num = event;
  }
};
</script>

<style scoped>
</style>
