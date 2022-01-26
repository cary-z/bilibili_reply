<template>
  <div>
    <el-form label-position="left">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item v-if="filter.otherid"
                        label="番剧号">
            <el-input placeholder="请输入番剧号"
                      v-model="filter.otherid"></el-input>
          </el-form-item>
          <el-form-item v-else
                        label="BV号">
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
          <el-form-item :label="filter.mode ? '正则表达式' : '关键词'">
            <el-input :placeholder="'请输入' + (filter.mode ? '正则表达式' : '关键词')"
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
            <el-input placeholder="请输入数量"
                      :model-value="filter.num"
                      @input="limitInput"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="(空输入搜索一个，输入*搜索全部)">
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search_button">
      <el-button type="primary"
                 :loading="view.flag"
                 @click="getReply">搜索</el-button>
      <el-button type="danger"
                 @click="stopGetReply">停止搜索</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, view, getReply } from './search'
import { watchEffect } from 'vue'
const stopGetReply = () => {
  view.value.flag = false
}
const limitInput = (event: string) => {
  if (Number(event) || ['', '*'].includes(event)) {
    filter.value.num = event
  }
}
watchEffect(() => {
  localStorage.setItem('REPLY_FILTER', JSON.stringify(filter.value))
})
</script>

<style scoped>
.search_button {
  display: flex;
}
</style>
