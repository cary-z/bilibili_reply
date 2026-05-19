import { getReplyInfo, getReplyDetail } from '../api/reply'
import { IMatchInfo, ISendPara, IReplies, ESortMode } from './type'
import { SleepMS } from '../libs/utils'

interface IResult {
  replies: IReplies[]
  top_replies: IReplies[]
  upper: { mid: number }
  cursor: {
    is_end: boolean
    all_count: number
    pagination_reply: {
      next_offset: string
    }
  }
}

export async function handleResult({ index, type, oid, mode, uid, pictures, regexp, offset }: ISendPara) {
  const result: IResult = await getReplyInfo({ type, oid, mode, offset })
  const info: IMatchInfo[] = []
  if (!result.replies) {
    return { flag: false }
  }
  let rp_num = 0
  const all_replies =
    index || mode === ESortMode.TIME ? result.replies : (result.top_replies ?? []).concat(result.replies)
  all_replies.forEach((item) => {
    const content: IMatchInfo = {
      uid: item.mid,
      uname: item.member.uname,
      action: item.action,
      like: item.like,
      rcount: item.rcount ?? 0,
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
    // rp_num += Number(item.reply_control?.sub_reply_entry_text?.replace(/共\s*(\d+)\s*条回复/, '$1') || 0) + 1
    rp_num += item.rcount + 1
    const matchUser = uid && Number(uid) === item.mid
    const hasPictures = content.pictures && content.pictures.length > 0
    const matchRegexp = regexp?.test(content.message)
    const matchRegexpFn = () => {
      regexp && matchRegexp && info.push(content)
      !regexp && info.push(content)
    }
    if (matchUser || !uid) {
      if (!pictures || hasPictures) {
        matchRegexpFn()
      }
    }
    return content
  })

  return {
    flag: !result.cursor.is_end,
    // length: replies.length,
    extraInfo: { rp_num, all_count: result.cursor.all_count, nextOffset: result.cursor?.pagination_reply?.next_offset },
    info
  }
}

function checkReplyMatch(reply: IReplies, para: ISendPara): boolean {
  if (!reply.content) return false
  const matchUser = para.uid && Number(para.uid) === reply.mid
  const hasPictures = reply.content.pictures && reply.content.pictures.length > 0
  const matchRegexp = para.regexp?.test(reply.content.message ?? '')
  if (matchUser || !para.uid) {
    if (!para.pictures || hasPictures) {
      if (para.regexp && matchRegexp) return true
      if (!para.regexp) return true
    }
  }
  return false
}

function replyToMatchInfo(reply: IReplies, upperUid: number): IMatchInfo {
  return {
    uid: reply.mid,
    uname: reply.member.uname,
    action: reply.action,
    like: reply.like,
    rcount: reply.rcount ?? 0,
    level: reply.member.level_info.current_level,
    upper_uid: upperUid,
    avatar: reply.member.avatar,
    sex: reply.member.sex,
    rpid: reply.rpid,
    message: reply.content?.message ?? '',
    emote: reply.content?.emote ?? {},
    jump_url: reply.content?.jump_url ?? {},
    members: reply.content?.members ?? [],
    time: reply.ctime,
    nickname_color: reply.member.vip?.nickname_color ?? '',
    pictures: reply.content?.pictures ?? [],
    reply_control: reply.reply_control ?? { location: '', sub_reply_entry_text: '' }
  }
}

export async function handleSubReplyResult(para: ISendPara) {
  const result: IResult = await getReplyInfo({ type: para.type, oid: para.oid, mode: para.mode, offset: para.offset })
  const info: IMatchInfo[] = []
  if (!result.replies) {
    return { flag: false }
  }
  let rp_num = 0
  const allReplies =
    para.index || para.mode === ESortMode.TIME ? result.replies : (result.top_replies ?? []).concat(result.replies)

  for (let i = 0; i < allReplies.length; i += 3) {
    const batch = allReplies.slice(i, i + 3)

    const batchResults = await Promise.all(
      batch.map(async (reply) => {
        rp_num += (reply.rcount ?? 0) + 1

        const parentMatch = checkReplyMatch(reply, para)

        const matchedChildren: IMatchInfo[] = []
        try {
          const subResult = await getReplyDetail({
            oid: para.oid,
            root: reply.rpid,
            type: para.type,
            pn: 1,
            ps: 20
          })
          const subReplies: IReplies[] = subResult?.replies ?? []
          for (const sub of subReplies) {
            if (checkReplyMatch(sub, para)) {
              matchedChildren.push(replyToMatchInfo(sub, result.upper.mid))
            }
          }
        } catch {
          // 子回复获取失败，跳过
        }

        if (parentMatch || matchedChildren.length > 0) {
          return {
            ...replyToMatchInfo(reply, result.upper.mid),
            children: matchedChildren.length > 0 ? matchedChildren : undefined
          }
        }
        return null
      })
    )

    for (const item of batchResults) {
      if (item !== null) info.push(item)
    }

    if (i + 3 < allReplies.length) {
      await SleepMS(500)
    }
  }

  return {
    flag: !result.cursor.is_end,
    extraInfo: { rp_num, all_count: result.cursor.all_count, nextOffset: result.cursor?.pagination_reply?.next_offset },
    info
  }
}
