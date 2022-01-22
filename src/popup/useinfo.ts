import { getAid, getReplyInfo } from "../api/reply";
import { IMatchInfo } from "./type";
import { SleepMS } from '../libs/utils'

interface ISuccessResult {
  flag: boolean
  length: number
  extraInfo: {
    next: number
    rp_num: number
    all_count: number
  }
  info: IMatchInfo | null
}

interface IPara {
  bvid: string
  uid: string
  regexp: RegExp | null
  num: string
}

export interface IView {
  flag: boolean
  reply_total: number
  reply_cur: number
}

export async function search({ bvid, uid, regexp, num }: IPara, view: IView, matchInfo: IMatchInfo[]) {
  let length = 0
  let next = 0
  const aid = await getAid(bvid)
  // let matchInfo: IMatchInfo[] = []
  for (let i = 0; ; i++) {
    if (!view.flag) break
    console.time(`第${i + 1}个发包`)
    const result = await handleResult({
      next: next,
      type: 1, // 1为视频，11为动态
      oid: aid, // 为瓶子庆生视频 764152550 原曲：送你一颗流星 889629324
      mode: 3, // 2 按时间排序 3 按热度排序
      uid,
      regexp,
    })
    console.timeEnd(`第${i + 1}个发包`)
    if (result.flag) {
      length += result.length + (result as ISuccessResult).extraInfo.rp_num
      view.reply_cur = length
      view.reply_total = (result as ISuccessResult).extraInfo.all_count
      next = (result as ISuccessResult).extraInfo.next
      if (result.info) {
        console.log((result as ISuccessResult).info)
        matchInfo.push((result as ISuccessResult).info as IMatchInfo)
        console.log('搜索到了')
        if (num !== '*' && matchInfo.length >= Number(num)) {
          break
        }
      }
    } else {
      view.reply_cur = view.reply_total
      console.log('未搜索到')
      break
    }
    await SleepMS(500);
  }
  console.log('找过的评论个数为' + length)
  // return matchInfo
}

async function handleResult({ next, type, oid, mode, uid, regexp }) {
  const result = await getReplyInfo({ next, type, oid, mode }).then(res => res.data.data)
    .catch((err) => {
      console.log(err)
    })
  let info: IMatchInfo | null = null
  if (!result.replies) {
    return { flag: false }
  }
  let rp_num = 0
  const all_replies = next ? result.replies : result.replies.concat(result.top_replies ?? [])
  const replies = all_replies.map((item) => {
    const content: IMatchInfo = {
      uid: item.mid,
      uname: item.member.uname,
      avatar: item.member.avatar,
      sex: item.member.sex,
      rpid: item.rpid,
      message: item.content.message,
      time: item.ctime,
    }
    rp_num += Number(item.reply_control?.sub_reply_entry_text?.replace(/共(\d+)条回复/, '$1') || 0)
    if (uid && uid === item.member.mid) {
      if (regexp) regexp.test(content.message) && (info = content)
      else info = content
    }
    if (!uid) {
      if (regexp) regexp.test(content.message) && (info = content)
    }
    return content
  })
  if (result.cursor.is_end) {
    return { flag: false }
  }
  return { flag: true, length: replies.length, extraInfo: { next: result.cursor.next, rp_num, all_count: result.cursor.all_count }, info }
}