<template>
  <div>
    <el-form label-position="left">
      <div class="title">{{ title }}</div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item v-if="filter.epid" label="EP号">
            <el-input placeholder="请输入EP号" v-model="filter.epid" clearable @keyup.enter="search"></el-input>
          </el-form-item>
          <el-form-item v-if="filter.dyid" label="DY号">
            <el-input placeholder="请输入DY号" v-model="filter.dyid" clearable @keyup.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="BV号">
            <el-input placeholder="请输入BV号" v-model="filter.bvid" clearable @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="uid">
            <el-input placeholder="请输入uid" v-model="filter.uid" clearable @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item :label="filter.searchMode ? '正则表达式' : '关键词'">
            <el-input
              :placeholder="'请输入' + (filter.searchMode ? '正则表达式' : '关键词')"
              v-model="filter.keyword"
              @keyup.enter="search"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-switch v-model="filter.searchMode" size="large" active-text="正则模式" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="filter.mode" placeholder="选择排序模式" size="large" clearable>
            <el-option label="热度排序" :value="ESortMode.HEAT"></el-option>
            <el-option label="时间排序" :value="ESortMode.TIME"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="数量">
            <el-input placeholder="请输入数量" :model-value="filter.num" @input="limitInput" clearable @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="(空输入搜索一个，输入*搜索全部)"></el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search_button">
      <el-button type="primary" :loading="view.flag" @click="search">搜索</el-button>
      <el-button type="primary" :loading="view.flag" @click="searchAll">搜索全部</el-button>
      <el-button type="primary" :loading="view.flag" @click="searchSchedule">搜索课代表</el-button>
      <el-button type="primary" :loading="view.flag" @click="searchPictures">搜索笔记</el-button>
      <el-button type="danger" @click="stopGetReply">停止搜索</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, view, title, getReply } from './search'
import { ESortMode } from './type'
const stopGetReply = () => {
  view.value.flag = false
}
const search = () => {
  filter.value.pictures = false
  getReply() 
}
const searchSchedule = () => {
  filter.value.pictures = false
  filter.value.searchMode = true
  filter.value.keyword = '/\\d+(:|：)\\d+/'
  getReply()
}
const searchPictures = () => {
  filter.value.pictures = true
  getReply() 
}
const searchAll = () => {
  filter.value.pictures = false
  filter.value.searchMode = true
  filter.value.keyword = '/.*/'
  filter.value.num = '*'
  getReply()
}
const limitInput = (event: string) => {
  if (Number(event) || ['', '*'].includes(event)) {
    filter.value.num = event
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}
.search_button {
  display: flex;
}
</style>
