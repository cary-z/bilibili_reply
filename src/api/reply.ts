import axios from './api_base'

interface IGetReplyPara {
  next?: number // 下个索引
  type?: number // 1为视频，11为动态
  oid: string // 视频aid
  mode?: number // 模式 2 按时间排序 3 按热度排序
}
export function getReplyInfo({ next = 0, type = 1, oid, mode = 3 }: IGetReplyPara) {
  return axios
    .get('https://api.bilibili.com/x/v2/reply/main', {
      params: {
        next,
        ps: 30,
        type,
        oid,
        mode,
        plat: 1,
        _: Date.now()
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

export async function getAidFormOtherId(otherid: string) {
  try {
    const type_map = { ep: 'ep_id', ss: 'season_id' }
    const short_type = otherid.slice(0, 2)
    const trueid = otherid.slice(2)
    const url = `https://api.bilibili.com/pgc/view/web/season?${type_map[short_type]}=${trueid}`
    const data = await axios.get(url).then((res: { data: any }) => res.data)
    const episodes = data.result.episodes
    const aid: string = episodes.find(item => item.id == trueid).aid
    return aid
  } catch (err) {
    console.log(err)
    if ((err as Error).message.includes('Network')) {
      throw new Error((err as Error).message)
    }
    throw new Error('番剧号有误')
  }
}

