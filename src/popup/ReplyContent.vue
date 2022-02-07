<template>
  <div>
    <div style="text-align: right">{{ view.reply_cur }}/{{ view.reply_total }}</div>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="Math.ceil((view.reply_cur / view.reply_total) * 100) || 0"
      status="success"
    />
    <div id="bilibili_reply" class="bb-comment">
      <template v-if="matchInfo.length > 0">
        <div v-for="(item, index) in matchInfo" :key="'matchInfo_' + index" class="info p-1">
          <el-tooltip
            effect="dark"
            :content="`序号:${index + 1} uid:${item.uid}`"
            placement="top-start"
          >
            <img :src="item.avatar.replace('http:','https:')" class="avatar" />
          </el-tooltip>
          <div class="ml-2">
            <a
              :style="`color:${item.nickname_color || '#6d757a'}`"
              :href="'https://space.bilibili.com/' + item.uid"
              target="_blank"
              class="uname"
            >{{ item.uname }}</a>
            <p
              v-if="/\n/.test(item.message) || item.emote || /\d+((：|:)\d+){1,2}/.test(item.message)"
              style="white-space: normal; word-break: break-all; overflow: hidden"
              v-html="replaceReply(item.message, item.emote)"
              class="message"
            ></p>
            <p
              v-else
              style="white-space: normal; word-break: break-all; overflow: hidden"
              class="message"
            >{{ item.message }}</p>
            <div class="time">{{ formatTime(item.time) }}</div>
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
import { view, matchInfo } from './search'
import { formatTime } from '../libs/utils'
const replaceReply = (message: string, emote) => {
  let str = message.replace(/\n/g, '<br>')
  if (emote) {
    for (const emoteKey in emote) {
      const item = emote[emoteKey]
      str = str.replace(new RegExp(item.text.replace(/(\[|\])/g,'\\$1'), 'g'), `<img style="width:20px;height:20px;vertical-align:text-bottom;" src="${item.url.replace('http:','')}@100w_100h.webp" class="small" alt="${item.text}">`)
    }
  }
  const regexp = /\d+((：|:)\d+){1,2}/
  if (regexp.test(message)) {
    str = str.replace(/\d+((：|:)\d+){1,2}/g,(match) => {
      if (match.includes(':') || match.includes('：')) {
        const arr = match.replace(/:|：/g,'-').split('-')
        const data_time = Number(arr[arr.length - 1]) * 1 + Number(arr[arr.length - 2]) * 60 + (Number(arr?.[arr.length - 3]) * 3600 || 0) + ''
        return `<a class="video-seek" onclick="document.querySelector('.bilibili-player-video video').currentTime = this.dataset.time;" data-p="-1" data-time="${data_time}">${match}</a>`
      } else {
        return match
      }
    })
  }
  return str
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  min-height: 80px;
  font-size: 12px;
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  .uname {
    font-weight: bold;
    line-height: 18px;
  }
  .message {
    font-size: 14px;
    padding: 5px 0;
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
