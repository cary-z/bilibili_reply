import { getAid, getReplyInfo } from "../api/api_base";

interface ISuccessResult {
  flag: boolean
  length: number
  extraInfo: {
    next: number
    rp_num: number
    all_count: number
  }
  info: any
}

interface IPara {
  bvid: string
  uid: string
  regexp: string
}

export interface IView {
  flag: boolean
  reply_total: number
  reply_cur: number
}

export async function search({ bvid, uid, regexp }: IPara, view: IView) {
  let length = 0
  let next = 0
  const aid = await getAid(bvid)
  let matchInfo: any = null
  for (let i = 0; ; i++) {
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
        const date = new Date((result as ISuccessResult).info.time * 1000);
        (result as ISuccessResult).info.ftime = `${date.getFullYear()}年${date.getMonth() + 1
          }月${date.getDate()}日${date.getHours()}:${date.getMinutes()}`
        console.log(result.info)
        matchInfo = result.info
        console.log('找到了')
        break
      }
    } else {
      console.log('没找到呢')
      break
    }
    await SleepMS(500);
  }
  console.log('找过的评论个数为' + length)
  return matchInfo || '无结果'
}

async function handleResult({ next, type, oid, mode, uid, regexp }) {
  const result = await getReplyInfo({ next, type, oid, mode }).then(res => res.data.data)
    .catch((err) => {
      console.log(err)
    })
  let info: unknown = null
  if (!result.replies) {
    return { flag: false }
  }
  let rp_num = 0
  const replies = result.replies.map((item) => {
    const content = {
      uid: item.mid,
      uname: item.member.uname,
      sex: item.member.sex,
      rpid: item.rpid,
      message: item.content.message,
      time: item.ctime,
    }
    rp_num += Number(item.reply_control?.sub_reply_entry_text?.replace(/共(\d+)条回复/, '$1') || 0)
    if (uid && uid === item.member.mid) info = content
    if (regexp) {
      let regExp: any = null
      try {
        regExp = eval(regexp)
        if (Object.prototype.toString.call(regExp) !== '[object RegExp]') {
          throw new Error('输入非正则表达式')
        }
      } catch (err: any) {
        throw new Error('正则表达式不正确，错误原因为' + err.message)
      }
      if (regExp.test(content.message)) info = content
    }
    return content
  })
  if (replies.length <= 0) {
    return { flag: false }
  }
  return { flag: true, length: replies.length, extraInfo: { next: result.cursor.next, rp_num, all_count: result.cursor.all_count }, info }
}

const SleepMS = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms))