<template>
  <div>
    <div style="text-align: right;">{{view.reply_cur}}/{{view.reply_total}}</div>
    <el-progress :text-inside="true"
                 :stroke-width="20"
                 :percentage="Math.ceil(view.reply_cur/view.reply_total*100) || 0"
                 status="success" />
    <div>
      <template v-if="matchInfo.length > 0">
        <div v-for="(item,index) in matchInfo"
             :key="'matchInfo_'+index"
             class="info p-1">
          <el-tooltip effect="dark"
                      :content="`序号:${index+1} uid:${item.uid}`"
                      placement="top-start">
            <img :src="item.avatar"
                 class="avatar">
          </el-tooltip>
          <div class="ml-2">
            <a :href="'https://space.bilibili.com/'+item.uid"
               target="_blank"
               class="uname">{{item.uname}}</a>
            <div class="message">{{item.message}}</div>
            <div class="time">{{formatTime(item.time)}}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no_result">
          <span>无结果</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { view, matchInfo } from "./search";
import { formatTime } from "../libs/utils";
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  min-height: 80px;
  font-size: 12px;
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .uname {
    color: #fb7299;
    font-weight: bold;
    line-height: 18px;
  }
  .message {
    font-size: 14px;
  }
  .time {
    color: #99a2aa;
  }
}
.no_result {
  display: flex;
  min-height: 80px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>
