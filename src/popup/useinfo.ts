import { getReplyInfo } from '../api/reply'
import { IMatchInfo, ISendPara, IReplies, ESortMode } from './type'

interface IResult {
  replies: IReplies[]
  top_replies: IReplies[]
  upper: { mid: number }
  cursor: {
    is_end: boolean
    next: number
    all_count: number
  }
}

export async function handleResult({ next, type, oid, mode, uid, pictures, regexp }: ISendPara) {
  const result: IResult = await getReplyInfo({ next, type, oid, mode })
  const info: IMatchInfo[] = []
  if (!result.replies) {
    return { flag: false }
  }
  let rp_num = 0
  const all_replies =
    next || mode === ESortMode.TIME ? result.replies : (result.top_replies ?? []).concat(result.replies)
  all_replies.forEach((item) => {
    const content: IMatchInfo = {
      uid: item.mid,
      uname: item.member.uname,
      action: item.action,
      like: item.like,
      level: item.member.level_info.current_level,
      upper_uid: result.upper.mid,
      avatar: item.member.avatar,
      sex: item.member.sex,
      rpid: item.rpid,
      message: item.content.message,
      emote: item.content.emote,
      jump_url: item.content.jump_url,
      members: item.content.members,
      time: item.ctime,
      nickname_color: item.member.vip.nickname_color,
      pictures: item.content.pictures,
      reply_control: item.reply_control
    }
    rp_num += Number(item.reply_control?.sub_reply_entry_text?.replace(/共(\d+)条回复/, '$1') || 0) + 1
    // rp_num += item.count || 1
    const matchUser = uid && Number(uid) === item.mid
    const hasPictures = content.pictures && content.pictures.length > 0
    const matchRegexp = regexp?.test(content.message)
    const matchRegexpFn = () => {
      regexp && matchRegexp && info.push(content)
      !regexp && info.push(content)
    }
    if (matchUser) {
      if (pictures) {
        hasPictures && matchRegexpFn()
      } else {
        matchRegexpFn()
      }
    } else if (!uid) {
      if (pictures) {
        hasPictures && matchRegexpFn()
      } else {
        matchRegexpFn()
      }
    }
    return content
  })
  if (result.cursor.is_end) {
    return { flag: false }
  }
  return {
    flag: true,
    // length: replies.length,
    extraInfo: { next: result.cursor.next, rp_num, all_count: result.cursor.all_count },
    info
  }
}
