<template>
  <div>
    <div style="text-align: right;">{{view.reply_cur}}/{{view.reply_total}}</div>
    <el-progress :text-inside="true"
                 :stroke-width="20"
                 :percentage="Math.ceil(view.reply_cur/view.reply_total*100) || 0"
                 status="success" />
    <div v-loading="view.flag">
      <template v-if="matchInfo.length > 0">
        <div v-for="(item,index) in matchInfo"
             :key="'matchInfo_'+index"
             class="info p-1">
          <img :src="item.avatar"
               class="avatar"
               :title="'uid:'+item.uid">
          <div class="ml-1">
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
import { ref, defineExpose } from "vue";
import { ElMessage } from "element-plus";
import { search, IView } from "./useinfo";
import { IMatchInfo } from "./type";
import { SleepMS } from "../libs/utils";
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
const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0,
});
const formatTime = (time: number) => {
  const date = new Date(time * 1000);
  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}:${date.getMinutes()}`;
};
const matchInfo = ref<IMatchInfo[]>([]);
const clear = () => {
  view.value.flag = true;
  view.value.reply_cur = 0;
  view.value.reply_total = 0;
};
const getReply = async () => {
  const { bvid, keyword, uid, num, mode } = props.filter;
  if (!keyword && !uid) {
    ElMessage.error("至少输入一条筛选条件");
    return;
  }
  let regexp: RegExp | null;
  if (mode) {
    try {
      regexp = eval(keyword);
    } catch (err) {
      ElMessage.error("正则表达式有误");
      return;
    }
    if (Object.prototype.toString.call(regexp) !== "[object RegExp]") {
      ElMessage.error("输入非正则表达式");
      return;
    }
  } else {
    regexp = keyword ? eval(`/${keyword}/g`) : null;
  }
  clear();
  await SleepMS(200);
  const result = await search({ bvid, uid, regexp, num }, view.value)
    .catch((err) => {
      console.log(err);
      ElMessage.error(err.message);
    })
    .finally(() => {
      view.value.flag = false;
    });
  result && (matchInfo.value = result);
};
defineExpose({ getReply });
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
