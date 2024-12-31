import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getAidFormBVid, getEPFormEpId, getAidFormDyid, getTitleInfo, replyAction, replyHate } from '../api/reply'
import { stringToRegexp } from '../libs/regexp'
import { SleepMS, debounce } from '../libs/utils'
import { handleResult } from './useinfo'
import { IFilter, IView, IMatchInfo, IHandleResult, EActionStatus, EStatus, EVideoType, ESortMode } from './type'

const getInitInfo = () => {
  const bvid: string = window['bvid'] ?? /\/video\/(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  const epid: string = window['ep']?.id ?? /\/bangumi\/play\/ep(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  const dyid: string = /t\.bilibili\.com\/(\d+)/.exec(window.location.href)?.[1] ?? ''
  return { bvid, epid, dyid }
}

const { bvid, epid, dyid } = getInitInfo()
const reply_filter: IFilter = {
  bvid,
  epid,
  dyid,
  uid: '',
  keyword: '',
  num: '1',
  pictures: false,
  searchMode: false,
  mode: ESortMode.HEAT
}
export const filter = ref(reply_filter)
const clearFilter = () => {
  filter.value = {
    bvid: '', // BV号
    epid: '', // 番剧号
    dyid: '', // 动态号
    keyword: '', // 关键词
    uid: '', // b站用户id
    num: '1', // 限制数量
    pictures: false,
    searchMode: false, // 模式（关键词或者正则）
    mode: ESortMode.HEAT // 模式（热度或者时间）
  }
}
!filter.value && clearFilter()
export const title = ref('')
export const view = ref<IView>({
  flag: false,
  reply_total: 0,
  reply_cur: 0
})
export const matchInfo = ref<IMatchInfo[]>([])
const isChromeExtension = () => window.location.href.startsWith('chrome-extension://')

if (isChromeExtension()) {
  const storageFilter = localStorage.getItem('REPLY_FILTER')
  const storageContent = localStorage.getItem('REPLY_CONTENT')
  const storageInfo = localStorage.getItem('REPLY_INFO')
  const storageTitle = localStorage.getItem('REPLY_TITLE')
  const scrollPosition = localStorage.getItem('SCROLL_POSITION')
  storageFilter && (filter.value = JSON.parse(storageFilter))
  storageContent && (matchInfo.value = JSON.parse(storageContent))
  storageInfo && (view.value = JSON.parse(storageInfo))
  storageTitle && (title.value = storageTitle)
  setTimeout(() => {
    scrollPosition && window.scrollTo(0, parseInt(scrollPosition, 10))
  }, 100)
}

const setReplyStorage = () => {
  localStorage.setItem('REPLY_INFO', JSON.stringify(view.value))
  localStorage.setItem('REPLY_CONTENT', JSON.stringify(matchInfo.value))
}

const setPositionStorage = () => {
  localStorage.setItem('SCROLL_POSITION', String(window.scrollY))
}

watch(filter.value, () => {
  isChromeExtension() && localStorage.setItem('REPLY_FILTER', JSON.stringify(filter.value))
})

watch(
  () => title.value,
  (val) => {
    isChromeExtension() && localStorage.setItem('REPLY_TITLE', title.value)
  }
)

watch(
  () => view.value.flag,
  (val) => {
    !val && isChromeExtension() && setReplyStorage()
  }
)

const handleScroll = () => {
  isChromeExtension() && setPositionStorage()
}

const debouncedHandleScroll = debounce(handleScroll, 200)

window.addEventListener('scroll', debouncedHandleScroll)

const getTitle = async () => {
  try {
    const { epid, bvid, dyid } = filter.value
    if (epid) {
      if (epid == getInitInfo().epid) title.value = window?.['ep']?.share_copy
      else title.value = (await getEPFormEpId(epid)).share_copy
    } else if (bvid) {
      if (bvid == getInitInfo().bvid && window['aid']) {
        title.value = await getTitleInfo(window['aid'])
      } else {
        const aid = await getAidFormBVid(bvid)
        title.value = await getTitleInfo(aid)
      }
    } else if (dyid) title.value = '动态'
  } catch (err) {
    ElMessage.error((err as Error).message)
  }
}
!title.value && getTitle()

// 番剧切换集数 或者根据推荐切换视频
const switchUpdate = async () => {
  const epid = /\/bangumi\/play\/ep(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  const bvid = /\/video\/(\w+)/.exec(window.location.pathname)?.[1] ?? ''
  bvid && clearFilter()
  filter.value = { ...filter.value, bvid, epid }
  getTitle()
}
window.addEventListener('replaceState', switchUpdate)
window.addEventListener('pushState', switchUpdate)

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
      regexp = new RegExp(keyword)
      const match = keyword.match(new RegExp('^/(.*?)/([gimuy]*)$'))
      if (match) {
        const corePattern = match[1]
        const flags = match[2]
        regexp = new RegExp(corePattern, flags)
        console.log(regexp)
      } else {
        throw new Error()
      }
    } catch (err) {
      throw new Error('正则表达式有误')
    }
  } else {
    regexp = keyword ? stringToRegexp(keyword) : null
    console.log(regexp)
  }
  return regexp
}

const getOid = async () => {
  const { bvid, epid, dyid } = filter.value
  if (bvid) {
    if (bvid == window['bvid']) return window['aid'] as string
    else {
      getTitle()
      return await getAidFormBVid(bvid)
    }
  } else if (epid) {
    if (window['ep']?.id == epid) return window['ep'].aid + ''
    else return (await getEPFormEpId(epid)).aid as string
  } else if (dyid) {
    return await getAidFormDyid(dyid)
  } else {
    title.value = ''
    throw new Error('无法获取oid')
  }
}

export const getReply = async () => {
  try {
    checkPara()
    const regexp = getRegexp()
    clearInfo()
    await SleepMS(200)
    const { dyid, uid, num, mode, pictures } = filter.value
    const oid = await getOid()
    let length = 0
    let next = 0
    let offset = ''
    for (let i = 0; ; i++) {
      if (!view.value.flag) break
      console.time(`第${i + 1}个发包`)
      const result = await handleResult({
        next,
        type: dyid ? EVideoType.DYNAMIC : EVideoType.VIDEO,
        oid,
        mode,
        uid,
        pictures,
        regexp,
        offset
      })
      console.timeEnd(`第${i + 1}个发包`)
      length += (result as IHandleResult).extraInfo.rp_num
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
      if (result.flag) {
        offset = (result as IHandleResult).extraInfo.nextOffset || ''
        view.value.reply_cur = length
        view.value.reply_total = (result as IHandleResult).extraInfo.all_count
        next = (result as IHandleResult).extraInfo.next
      } else {
        view.value.reply_cur = view.value.reply_total
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

export const ReplyAction = async (info: IMatchInfo) => {
  try {
    const oid = await getOid()
    const { action, like, rpid } = info
    const { dyid } = filter.value
    const csrf = /(?<=bili_jct=)\w+/.exec(document.cookie)?.[0]
    if (!csrf) {
      ElMessage.error('csrf不存在，可尝试重新登陆')
      return
    }
    const { code, message } = await replyAction({
      oid,
      type: dyid ? EVideoType.DYNAMIC : EVideoType.VIDEO,
      rpid,
      action: action === EActionStatus.LIKE ? EStatus.CANCEL : EStatus.SURE,
      csrf
    })
    if (code) {
      ElMessage.error(message)
    } else {
      const action_flag = action === EActionStatus.LIKE
      info.action = action_flag ? EActionStatus.STATELESS : EActionStatus.LIKE
      info.like = action_flag ? like - 1 : like + 1
      ElMessage.success(action_flag ? '取消点赞' : '点赞成功')
    }
  } catch (err) {
    ElMessage.error((err as Error).message)
  }
}

export const ReplyHate = async (info: IMatchInfo) => {
  try {
    const oid = await getOid()
    const { action, rpid } = info
    const { dyid } = filter.value
    const csrf = /(?<=bili_jct=)\w+/.exec(document.cookie)?.[0]
    if (!csrf) {
      ElMessage.error('csrf不存在，可尝试重新登陆')
      return
    }
    const { code, message } = await replyHate({
      oid,
      type: dyid ? EVideoType.DYNAMIC : EVideoType.VIDEO,
      rpid,
      action: action === EActionStatus.HATE ? EStatus.CANCEL : EStatus.SURE,
      csrf
    })
    if (code) {
      ElMessage.error(message)
    } else {
      const action_flag = action === EActionStatus.HATE
      info.action = action_flag ? EActionStatus.STATELESS : EActionStatus.HATE
      if (action === EActionStatus.LIKE && !action_flag) info.like--
      ElMessage.success(action_flag ? '取消点踩' : '点踩成功')
    }
  } catch (err) {
    ElMessage.error((err as Error).message)
  }
}
