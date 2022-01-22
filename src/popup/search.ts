import { ref } from "vue";
import { ElMessage } from "element-plus";
import { stringToRegexp } from "../libs/regexp";
import { SleepMS } from "../libs/utils";
import { search } from "./useinfo";
import { IView, IMatchInfo } from './type'
export const filter = ref({
  // 查询条件
  bvid: "", // BV号
  keyword: "", // 关键词
  uid: "", // b站用户id
  num: "1", // 限制数量
  mode: false, // 模式（关键词或者正则）
});
export const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0,
});
export const matchInfo = ref<IMatchInfo[]>([]);

export const clearInfo = () => {
  matchInfo.value = [];
  view.value.flag = true;
  view.value.reply_cur = 0;
  view.value.reply_total = 0;
};

export const getReply = async () => {
  const { bvid, keyword, uid, num, mode } = filter.value;
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
    regexp = keyword ? stringToRegexp(keyword) : null;
    console.log(regexp);
  }
  clearInfo();
  await SleepMS(200);
  await search({ bvid, uid, regexp, num }, view.value, matchInfo.value)
    .then(() => {
      ElMessage.success("搜索完成");
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error(err.message);
    })
    .finally(() => {
      view.value.flag = false;
    });
};

