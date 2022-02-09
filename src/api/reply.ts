import axios from './api_base'

interface IGetReplyPara {
  next?: number // 下个索引
  type?: number // 1为视频，11为动态
  oid: string // 视频aid
  mode?: number // 模式 2 按时间排序 3 按热度排序
}
interface IReplyActionPara {
  oid: string // 视频aid
  type?: number // 1为视频，11为动态
  rpid: number // 评论id
  action: number // 0为取消 1为确定
  csrf: string // csrf验证
}
export async function getReplyInfo(getReplyPara: IGetReplyPara) {
  return getReplyNewAPI(getReplyPara)
}

async function getReplyNewAPI({ next = 0, type = 1, oid, mode = 3 }: IGetReplyPara) {
  return axios
    .get('https://api.bilibili.com/x/v2/reply/main', {
      params: {
        next,
        ps: 30,
        type,
        oid,
        mode,
        plat: 1
      }
    })
    .then(data => data.data)
}

// async function getReplyOldAPI({ next = 0, type = 1, oid, mode = 3 }: IGetReplyPara) {
//   // 模式映射
//   const modeMap = {
//     2: 0, // 时间排序
//     3: 2 // 热度排序
//   }
//   return axios
//     .get('https://api.bilibili.com/x/v2/reply', {
//       params: {
//         pn: next,
//         ps: 49,
//         type,
//         oid,
//         mode,
//         sort: modeMap[mode]
//       }
//     })
//     .then((res) => res.data.data)
//     .catch((err: any) => err)
// }

export async function getAidFormBVid(bvid: string) {
  const url1 = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`
  const [{ cid }] = (await axios.get(url1) as any).data
  const url2 = `https://api.bilibili.com/x/player/v2?cid=${cid}&bvid=${bvid}`
  const { aid }: { aid: string } = (await axios.get(url2) as any).data
  return aid
}

export async function getEPFormEpId(epid: string) {
  const url = `https://api.bilibili.com/pgc/view/web/season?ep_id=${epid}`
  const data: any = await axios.get(url)
  const episodes = data.result.episodes.find((item) => item.id == epid)
  return episodes
}

export async function getAidFormDyid(dyid: string) {
  const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dyid}`
  const data: any = await axios.get(url)
  const aid: string = data.data.card.desc.rid_str
  return aid
}

export async function getTitleInfo(aid: string): Promise<string> {
  const url = `https://api.bilibili.com/x/web-interface/view?aid=${aid}`
  const { title } = (await axios.get(url) as any).data
  return title
}

export async function replyAction({ oid, type = 1, rpid, action, csrf }: IReplyActionPara) {
  const data = `oid=${oid}&type=${type}&rpid=${rpid}&action=${action}&csrf=${csrf}`
  const url = `https://api.bilibili.com/x/v2/reply/action`
  const { code, message } = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }) as any
  return { code, message }
}

export async function replyHate({ oid, type = 1, rpid, action, csrf }: IReplyActionPara) {
  const data = `oid=${oid}&type=${type}&rpid=${rpid}&action=${action}&csrf=${csrf}`
  const url = `https://api.bilibili.com/x/v2/reply/hate`
  const { code, message } = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }) as any
  return { code, message }
}
