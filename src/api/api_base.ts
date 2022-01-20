import axios from 'axios'

const Axios = axios.create({
  timeout: 20000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

//POST传参序列化(添加请求拦截器)
// Axios.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     // error 的回调信息
//     return Promise.reject(error.data.error.message)
//   }
// )

//返回状态判断(添加响应拦截器)
// Axios.interceptors.response.use(
//   (res) => {
//     return res
//   },
//   (error) => {
//     return error
//   }
// )

interface IGetReplyPara {
  next?: number // 下个索引
  type?: number // 1为视频，11为动态
  oid: string // 视频aid
  mode?: number // 模式 2 按时间排序 3 按热度排序
}
export function getReplyInfo({ next = 0, type = 1, oid, mode = 3 }: IGetReplyPara) {
  return axios.get('https://api.bilibili.com/x/v2/reply/main', {
    params: {
      next,
      ps: 30,
      type,
      oid,
      mode,
      plat: 1,
      _: Date.now(),
    }
  }).catch((err: any) => err)
}

export async function getAid(bvid: string) {
  const url1 = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`
  const [{ cid }] = (await axios.get(url1).then((res: { data: any }) => res.data)).data
  const url2 = `https://api.bilibili.com/x/player/v2?cid=${cid}&bvid=${bvid}`
  const { aid }: { aid: string } = (await axios.get(url2).then((res: { data: any }) => res.data)).data
  return aid
}

export default Axios