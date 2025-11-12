<template>
  <div>
    <el-form label-position="left">
      <div class="title">{{ title }}</div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item v-if="filter.epid" label="EP号">
            <el-input v-model="filter.epid" placeholder="请输入EP号" clearable @keyup.enter="search"></el-input>
          </el-form-item>
          <el-form-item v-if="filter.dyid" label="DY号">
            <el-input v-model="filter.dyid" placeholder="请输入DY号" clearable @keyup.enter="search"></el-input>
          </el-form-item>
          <el-form-item label="BV号">
            <el-input v-model="filter.bvid" placeholder="请输入BV号" clearable @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="uid">
            <el-input v-model="filter.uid" placeholder="请输入uid" clearable @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item :label="filter.searchMode ? '正则表达式' : '关键词'">
            <el-input
              v-model="filter.keyword"
              :placeholder="'请输入' + (filter.searchMode ? '正则表达式' : '关键词')"
              clearable
              @keyup.enter="search"></el-input>
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
            <el-input
              placeholder="请输入数量"
              :model-value="filter.num"
              clearable
              @input="limitInput"
              @keyup.enter="search"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search-actions">
      <el-button
        type="primary"
        class="btn search"
        :loading="view.searchStatus === ESearchStatus.SEARCHING"
        @click="search">
        搜索
      </el-button>
      <el-button
        type="primary"
        class="btn schedule"
        :loading="view.searchStatus === ESearchStatus.SEARCHING"
        @click="searchSchedule">
        搜索课代表
      </el-button>
      <el-button
        type="primary"
        class="btn notes"
        :loading="view.searchStatus === ESearchStatus.SEARCHING"
        @click="searchPictures">
        搜索笔记
      </el-button>
      <el-button
        type="warning"
        class="btn clear"
        :loading="view.searchStatus === ESearchStatus.SEARCHING"
        @click="clearData">
        清空数据
      </el-button>
      <el-button
        v-show="view.searchStatus === ESearchStatus.SEARCHING"
        type="danger"
        class="btn stop"
        @click="stopGetReply">
        停止搜索
      </el-button>
      <el-button
        v-show="view.searchStatus === ESearchStatus.PAUSED"
        type="primary"
        class="btn continue"
        @click="continueGetReply">
        继续搜索
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, view, title, getReply, clearInfo } from './search'
import { ESortMode, ESearchStatus } from './type'
const stopGetReply = () => {
  view.value.searchStatus = ESearchStatus.PAUSED
}
const continueGetReply = () => {
  view.value.searchStatus = ESearchStatus.SEARCHING
  getReply()
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
const clearData = () => {
  title.value = ''
  view.value.searchStatus = ESearchStatus.IDLE
  clearInfo()
}

const limitInput = (event: string) => {
  filter.value.num = Number(event) > 0 ? String(Math.floor(Number(event))) : ''
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}
.search-actions {
  display: flex;

  .btn {
    border: none;
    border-radius: 8px;
    color: #fff;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

    &.search {
      background: linear-gradient(135deg, #6fa8ff, #a1c4fd);
    }

    &.schedule {
      background: linear-gradient(135deg, #6fa8ff, #a1c4fd);
    }

    &.notes {
      background: linear-gradient(135deg, #6fa8ff, #a1c4fd);
    }

    &.clear {
      background: #ffb347;
    }

    &.stop {
      background: linear-gradient(135deg, #ff7f7f, #ff5252);
    }

    &.continue {
      background: linear-gradient(135deg, #00cc44, #88ee88);
    }

    &:hover:not(:disabled) {
      filter: brightness(1.07);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      filter: brightness(0.95);
    }
  }
}
</style>
