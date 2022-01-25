import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAid } from '../api/reply'
import { stringToRegexp } from '../libs/regexp'
import { SleepMS } from '../libs/utils'
import { handleResult } from './useinfo'
import { IFilter, IView, IMatchInfo, IHandleResult } from './type'

const bvid = /\/video\/(\w+)/.exec(window.location.pathname)?.[1]
const storage_filter = localStorage.getItem('REPLY_FILTER')
const reply_filter = (bvid && { bvid }) || (storage_filter && JSON.parse(storage_filter))
export const filter = ref<IFilter>(
  reply_filter || {
    // 查询条件
    bvid: '', // BV号
    keyword: '', // 关键词
    uid: '', // b站用户id
    num: '1', // 限制数量
    mode: false // 模式（关键词或者正则）
  }
)
export const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0
})
export const matchInfo = ref<IMatchInfo[]>([])

export const clearInfo = () => {
  matchInfo.value = []
  view.value.flag = true
  view.value.reply_cur = 0
  view.value.reply_total = 0
}

const checkPara = () => {
  const { keyword, uid } = filter.value
  if (!keyword && !uid) {
    throw new Error('至少输入一条筛选条件')
  }
}

const getRegexp = () => {
  const { keyword, mode } = filter.value
  let regexp: RegExp | null
  if (mode) {
    try {
      regexp = eval(keyword)
    } catch (err) {
      throw new Error('正则表达式有误')
    }
    if (Object.prototype.toString.call(regexp) !== '[object RegExp]') {
      throw new Error('输入非正则表达式')
    }
  } else {
    regexp = keyword ? stringToRegexp(keyword) : null
    console.log(regexp)
  }
  return regexp
}

export const getReply = async () => {
  let regexp: RegExp | null
  try {
    checkPara()
    regexp = getRegexp()
  } catch (err) {
    ElMessage.error((err as Error).message)
    return
  }
  clearInfo()
  await SleepMS(200)
  const { bvid, uid, num } = filter.value
  const oid = window['aid'] || (await getAid(bvid))
  let length = 0
  let next = 0
  for (let i = 0; ; i++) {
    if (!view.value.flag) break
    console.time(`第${i + 1}个发包`)
    const result = await handleResult({ next, type: 1, oid, mode: 3, uid, regexp })
    console.timeEnd(`第${i + 1}个发包`)
    if (result.flag) {
      length += (result as IHandleResult).length + (result as IHandleResult).extraInfo.rp_num
      view.value.reply_cur = length
      view.value.reply_total = (result as IHandleResult).extraInfo.all_count
      next = (result as IHandleResult).extraInfo.next
      if (result.info && result.info.length > 0) {
        console.log((result as IHandleResult).info)
        for (const item of (result as IHandleResult).info) {
          matchInfo.value.push(item)
          if (num !== '*' && matchInfo.value.length >= Number(num ?? 0)) {
            view.value.flag = false
            break
          }
        }
      }
    } else {
      view.value.reply_cur = view.value.reply_total
      console.log('未搜索到')
      break
    }
    await SleepMS(500)
  }
  ElMessage.success('搜索完成')
  view.value.flag = false
  console.log('找过的评论个数为' + length)
}
