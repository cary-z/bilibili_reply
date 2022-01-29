import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAidFormBVid, getEPFormEpId, getTitleInfo } from '../api/reply'
import { stringToRegexp } from '../libs/regexp'
import { SleepMS } from '../libs/utils'
import { handleResult } from './useinfo'
import { IFilter, IView, IMatchInfo, IHandleResult } from './type'

const getInitInfo = () => {
  const bvid: string = window['bvid'] ?? /\/video\/(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  const epid: string = window['ep']?.id ?? /\/bangumi\/play\/ep(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  return { bvid, epid }
}

const { bvid, epid } = getInitInfo()
const storage_filter = localStorage.getItem('REPLY_FILTER')
const reply_filter = ((bvid || epid) && { bvid, epid, mode: 3 }) || (storage_filter && JSON.parse(storage_filter))
export const filter = ref<IFilter>(
  reply_filter || {
    // 查询条件
    bvid: '', // BV号
    epid: '', // 番剧号
    keyword: '', // 关键词
    uid: '', // b站用户id
    num: '1', // 限制数量
    searchMode: false, // 模式（关键词或者正则）
    mode: 3 // 模式（热度或者时间）
  }
)
export const title = ref('')
export const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0
})
export const matchInfo = ref<IMatchInfo[]>([])

const getTitle = async () => {
  try {
    const { epid, bvid } = filter.value
    if (epid) {
      if (epid == getInitInfo().epid) title.value = window?.['ep']?.share_copy
      else title.value = (await getEPFormEpId(epid)).share_copy
    }
    else if (bvid) {
      if (bvid == getInitInfo().bvid) title.value = await getTitleInfo(window['aid'])
      else {
        const aid = await getAidFormBVid(bvid)
        title.value = await getTitleInfo(aid)
      }
    }
  } catch (err) {
    ElMessage.error((err as Error).message)
  }
}
getTitle()

// 番剧切换集数 或者根据推荐切换视频
const switchUpdate = async () => {
  const epid = /\/bangumi\/play\/ep(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  const bvid = /\/video\/(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  filter.value = { ...filter.value, bvid, epid }
  getTitle()
}
window.addEventListener("replaceState", switchUpdate)
window.addEventListener("pushState", switchUpdate)

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
  const { keyword, searchMode } = filter.value
  let regexp: RegExp | null
  if (searchMode) {
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

const getOid = async () => {
  const { bvid, epid } = filter.value
  if (bvid) {
    if (bvid == window['bvid']) return window['aid']
    else {
      getTitle()
      return await getAidFormBVid(bvid)
    }
  } else if (epid) {
    if (window['ep']?.id == epid) return window['ep'].aid + ''
    else return (await getEPFormEpId(epid)).aid
  } else {
    throw new Error('无法获取oid')
  }
}

export const getReply = async () => {
  try {
    let regexp: RegExp | null
    checkPara()
    regexp = getRegexp()
    clearInfo()
    await SleepMS(200)
    const { uid, num, mode } = filter.value
    const oid = await getOid()
    let length = 0
    let next = 0
    for (let i = 0; ; i++) {
      if (!view.value.flag) break
      console.time(`第${i + 1}个发包`)
      const result = await handleResult({ next, type: 1, oid, mode, uid, regexp })
      console.timeEnd(`第${i + 1}个发包`)
      if (result.flag) {
        length += (result as IHandleResult).extraInfo.rp_num
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
  } catch (err) {
    ElMessage.error((err as Error).message)
    view.value.flag = false
  }
}
