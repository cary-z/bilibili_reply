<template>
  <div>
    <div style="text-align: right;">{{props.view.reply_cur}}/{{props.view.reply_total}}</div>
    <el-progress :text-inside="true"
                 :stroke-width="20"
                 :percentage="Math.ceil(props.view.reply_cur/props.view.reply_total*100) || 0"
                 status="success" />
    <div>
      <template v-if="matchInfo.length > 0">
        <div v-for="(item,index) in matchInfo"
             :key="'matchInfo_'+index"
             class="info p-1">
          <el-tooltip effect="dark"
                      :content="'uid:'+item.uid"
                      placement="top-start">
            <img :src="item.avatar"
                 class="avatar">
          </el-tooltip>
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
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { search } from "./useinfo";
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
  view: {
    flag: boolean;
    reply_total: number;
    reply_cur: number;
  };
}

const props = defineProps<IProps>();
// const view = ref<IView>({
//   flag: false,
//   reply_total: 0,
//   reply_cur: 0,
// });
const formatTime = (time: number) => {
  const date = new Date(time * 1000);
  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}:${date.getMinutes()}`;
};
const matchInfo = ref<IMatchInfo[]>([]);
const clear = () => {
  matchInfo.value = [];
  props.view.flag = true;
  props.view.reply_cur = 0;
  props.view.reply_total = 0;
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
    const arr = [
      "^",
      "$",
      ".",
      "*",
      "+",
      "?",
      "|",
      "\\",
      "/",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      "-",
      ",",
    ];
    const regexp_special = new RegExp(`(\\${arr.join("|\\")})`, "g");
    const new_keyword = keyword.replace(regexp_special, "\\$1");
    console.log(new_keyword);
    regexp = keyword ? new RegExp(new_keyword, "g") : null;
    console.log(regexp);
  }
  clear();
  await SleepMS(200);
  await search({ bvid, uid, regexp, num }, props.view, matchInfo.value)
    .then(() => {
      ElMessage.success("搜索完成");
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error(err.message);
    })
    .finally(() => {
      props.view.flag = false;
    });
  // result && (matchInfo.value = result);
};
const stopGetReply = () => {
  props.view.flag = false;
};
defineExpose({ getReply, stopGetReply });
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
