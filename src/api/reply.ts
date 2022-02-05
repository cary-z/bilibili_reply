import axios from './api_base'

interface IGetReplyPara {
  next?: number // 下个索引
  type?: number // 1为视频，11为动态
  oid: string // 视频aid
  mode?: number // 模式 2 按时间排序 3 按热度排序
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
    .then((res) => res.data.data)
    .catch((err: any) => err)
}

async function getReplyOldAPI({ next = 0, type = 1, oid, mode = 3 }: IGetReplyPara) {
  // 模式映射
  const modeMap = {
    2: 0, // 时间排序
    3: 2 // 热度排序
  }
  return axios
    .get('https://api.bilibili.com/x/v2/reply', {
      params: {
        pn: next,
        ps: 49,
        type,
        oid,
        mode,
        sort: modeMap[mode]
      }
    })
    .then((res) => res.data.data)
    .catch((err: any) => err)
}

export async function getAidFormBVid(bvid: string) {
  try {
    const url1 = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`
    const [{ cid }] = (await axios.get(url1).then((res: { data: any }) => res.data)).data
    const url2 = `https://api.bilibili.com/x/player/v2?cid=${cid}&bvid=${bvid}`
    const { aid }: { aid: string } = (await axios.get(url2).then((res: { data: any }) => res.data)).data
    return aid
  } catch (err) {
    console.log(err)
    if ((err as Error).message.includes('Network')) {
      throw new Error((err as Error).message)
    }
    throw new Error('BV号有误')
  }
}

export async function getEPFormEpId(epid: string) {
  try {
    const url = `https://api.bilibili.com/pgc/view/web/season?ep_id=${epid}`
    const data = await axios.get(url).then((res: { data: any }) => res.data)
    const episodes = data.result.episodes.find((item) => item.id == epid)
    return episodes
  } catch (err) {
    console.log(err)
    if ((err as Error).message.includes('Network')) {
      throw new Error((err as Error).message)
    }
    throw new Error('EP号有误')
  }
}

export async function getAidFormDyid(dyid: string) {
  try {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dyid}`
    const data = await axios.get(url).then((res: { data: any }) => res.data)
    const aid: string = data.data.card.desc.rid_str
    return aid
  } catch (err) {
    console.log(err)
    if ((err as Error).message.includes('Network')) {
      throw new Error((err as Error).message)
    }
    throw new Error('DY号有误')
  }
}

export async function getTitleInfo(aid: string): Promise<string> {
  try {
    const url = `https://api.bilibili.com/x/web-interface/view?aid=${aid}`
    const { title } = (await axios.get(url).then((res: { data: any }) => res.data)).data
    return title
  } catch (err) {
    console.log(err)
    if ((err as Error).message.includes('Network')) {
      throw new Error((err as Error).message)
    }
    throw new Error('无法获取标题')
  }
}
