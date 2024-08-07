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
            <img :src="item.avatar.replace('http:', 'https:')" class="avatar" />
          </el-tooltip>
          <div class="ml-2">
            <a
              :style="`color:${item.nickname_color || '#6d757a'};vertical-align: middle;`"
              :href="'https://space.bilibili.com/' + item.uid"
              target="_blank"
              class="uname"
            >{{ item.uname }}</a>
            <Svg :level="item.level" />
            <span v-if="item.upper_uid === item.uid" class="stick_up" style="width:16px">
              <div class="tinyfont">UP</div>
            </span>
            <div class="replier-location">{{ item.reply_control?.location || '' }}</div>
            <p
              v-if="checkReplace(item)"
              style="white-space: normal; word-break: break-all; overflow: hidden"
              v-html="replaceReply(item)"
              class="message"
            ></p>
            <p
              v-else
              style="white-space: normal; word-break: break-all; overflow: hidden"
              class="message"
            >{{ item.message }}</p>
            <div class="reply_bottom">
              <span class="time">{{ formatTime(item.time) }}</span>
              <span :class="`like ${item.action === EActionStatus.LIKE ? 'liked' : ''}`" @click="ReplyAction(item)">
                <i></i>
                <span>{{item.like || ''}}</span>
              </span>
              <span :class="`hate ${item.action === EActionStatus.HATE ? 'hated' : ''}`" @click="ReplyHate(item)">
                <i></i>
              </span>
            </div>
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
import { nextTick } from 'vue';
import Svg from './Svg.vue'
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { view, matchInfo, ReplyAction, ReplyHate } from './search'
import { formatTime } from '../libs/utils'
import { IMatchInfo, EActionStatus } from './type'

const regexp = /\d+((：|:)\d+){1,2}/
const checkReplace = (matchInfo: IMatchInfo) => {
  return /\n/.test(matchInfo.message) || matchInfo.emote || regexp.test(matchInfo.message) || matchInfo.jump_url || matchInfo.members
}
const replaceReply = (matchInfo: IMatchInfo) => {
  const { message, emote, jump_url, members, pictures } = matchInfo
  let str = message
  // 处理换行
  if (/\n/.test(message)) str = str.replace(/\n/g, '<br>')
  // 处理表情包
  if (emote) {
    for (const emoteKey in emote) {
      const item = emote[emoteKey]
      const className = item.meta.size === 1 ? 'small' : 'middle'
      str = str.replace(
        new RegExp(item.text.replace(/(\[|\])/g, '\\$1'), 'g'),
        `<img src="${item.url.replace(
          'http:',
          ''
        ).replace(/@.*/,'')}@100w_100h.webp" class="${className}" alt="${item.text}">`
      )
    }
  }
  // 处理跳转时间
  if (regexp.test(message)) {
    str = str.replace(/\d+((：|:)\d+){1,2}/g, match => {
      if (match.includes(':') || match.includes('：')) {
        const arr = match.replace(/:|：/g, '-').split('-')
        const data_time =
          Number(arr[arr.length - 1]) * 1 +
          Number(arr[arr.length - 2]) * 60 +
          (Number(arr?.[arr.length - 3]) * 3600 || 0) +
          ''
        return `<a class="jump-link video-time" onclick="document.querySelector('.bpx-player-video-wrap video').currentTime = this.dataset.time;" data-p="-1" data-time="${data_time}">${match}</a>`
      } else {
        return match
      }
    })
  }
  // 处理链接
  if (Object.keys(jump_url).length > 0) {
    const addProtocolPrefix = (url: string) => {
      if(url.startsWith('https:')) {
        return url
      }
      return 'https:' + url
    }
    let index = 0
    for (const url in jump_url) {
      const item = jump_url[url]
      // 关键词链接
      if (item.pc_url) {
        str = str.replace(url, `
          <a href="${addProtocolPrefix(item.pc_url)}" data-report="${index++}" class="comment-jump-url" target="_blank">${item.title}</a>
          <i class="icon search-word" style="display:inline-block;width: 12px;height: 20px;vertical-align: text-top;background-size: contain;background-image: url(${item.prefix_icon})"></i>
        `)
      } else {
        // 普通视频链接
        str = str.replace(url, `
          <img style="vertical-align: middle;height: 20px;" src="${item.prefix_icon}" class="jump-img">
          <a style="vertical-align: middle;" href="${addProtocolPrefix(url)}" data-report="${index++}" class="comment-jump-url" target="_blank">${item.title}</a>
        `)
      }
    }
  }
  // 处理@用户
  if (members.length > 0) {
    const nameArr = members.map(item => item.uname)
    str = str.replace(new RegExp('@(' + nameArr.join('|') + ')', 'g'), match => {
      const index = nameArr.findIndex(item => match.slice(1) === item)
      return `<a href="https://space.bilibili.com/${members[index].mid}" target="_blank" data-usercard-mid="${members[index].mid}">${match} </a>`
    })
  }
  // 处理笔记的图片
  if (pictures && pictures.length > 0) {
    const imgStr = pictures.map(picture => (`
      <li class="image-item-wrap vertical" style="width: 88px; height: 88px;">
        <img src="${picture.img_src}@88w_88h_1c_1s_!web-comment-note.avif" alt="image">
      </li>
    `)).join('');
    str += `
    <ul id="bilibili-reply__note-picture" class="preview-image-container">
      ${imgStr}
    </ul>
    `;
  }
  nextTick(() => {
    // 给图片绑定点击事件
    const imageElements = document.querySelectorAll('#bilibili-reply__note-picture');
    imageElements.forEach(function(element) {
      new Viewer(element as HTMLElement, {
        url(image) {
          return image.src.replace('@88w_88h_1c_1s_!web-comment-note.avif', '@!web-comment-note.avif');
        },
        title: false,
        rotatable: false,
        scalable: false,
      })
    });
  })
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
  .replier-location {
    color: #99a2aa;
  }
  .message {
    font-size: 14px;
    padding: 5px 0;
  }
  .reply_bottom {
    color: #99a2aa;
    & > span {
      margin-right: 20px;
    }
    .like {
      cursor: pointer;
      vertical-align: middle;
      &:hover i {
        background-position: -218px -25px;
      }
      &.liked i {
        background-position: -154px -89px;
      }
      i {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: text-top;
        margin-right: 5px;
        background: url(https://s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/icons-comment.2f36fc5.png)
          no-repeat;
        background-position: -153px -25px;
      }
    }
    .hate {
      cursor: pointer;
      vertical-align: middle;
      &:hover i {
        background-position: -217px -153px;
      }
      &.hated i {
        background-position: -154px -217px;
      }
      i {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: text-top;
        margin-right: 5px;
        background: url(https://s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/icons-comment.2f36fc5.png)
          no-repeat;
        background-position: -153px -153px;
      }
    }
  }
  & ::v-deep(.small) {
    width:20px;
    height:20px;
    vertical-align:text-bottom;
  }
  & ::v-deep(.middle) {
    padding: 0 1px;
    width: 50px;
    height: 50px;
    vertical-align: text-bottom;
  }
}
.stick_up {
  display: inline-block;
  vertical-align: middle;
  min-width: 0px;
  margin-left: 8px;
  line-height: 11px;
  height: 10px;
  font-size: 9px;
  border-radius: 1px;
  background-color: #fb7299;
  color: #fff;
  border: 1px solid #ff81aa;
  .tinyfont {
    width: 200%;
    height: 200%;
    padding-left: 2px;
    font-weight: 400;
    transform-origin: center;
    transform: scale(0.5) translate(-50%, -50%);
    font-size: 20px;
    line-height: 20px;
    box-sizing: border-box;
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
<style lang="scss">
#bilibili-reply__note-picture.preview-image-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 364px;
  row-gap: 4px;
  column-gap: 4px;
  padding: 5px 0;
  .image-item-wrap {
    flex-direction: column;
    img {
      cursor: pointer;
      border-radius: 6px;
    }
  }
}
</style>
