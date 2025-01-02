export interface IFilter {
  bvid: string // BV号
  epid: string // 番剧号
  dyid: string // 动态号
  keyword: string // 关键词
  uid: string // b站用户id
  num: string // 限制数量
  pictures: boolean // 是否搜索笔记
  searchMode: boolean // 模式（关键词或者正则）
  mode: ESortMode // 模式（热度或者时间）
}
export interface IView {
  flag: boolean
  reply_total: number
  reply_cur: number
}

interface IOriginalInfo {
  message: string
  emote: {
    [key: string]: {
      meta: { size: number }
      text: string
      url: string
    }
  }
  jump_url: {
    [key: string]: { prefix_icon: string; title: string, pc_url: string }
  }
  members: {
    mid: string
    uname: string
  }[]
  pictures: {
    img_src: string
    img_width: number
    img_height: number
    img_size: number
  }[],
  reply_control: {
    location: string
  }
}
export interface IMatchInfo extends IOriginalInfo {
  uid: number
  uname: string
  action: number
  like: number
  upper_uid: number
  level: number
  avatar: string
  sex: string
  rpid: number
  time: number
  nickname_color: string
}

export enum EVideoType {
  VIDEO = 1, // 视频
  DYNAMIC = 11 // 动态
}

export enum ESortMode {
  TIME = 2, // 时间
  HEAT = 3 // 热度
}

export enum EActionStatus {
  STATELESS = 0, // 无状态
  LIKE = 1, // 已点赞
  HATE = 2 // 已点踩
}

export enum EStatus {
  CANCEL = 0, // 取消
  SURE = 1 // 确定
}

export interface ISendPara {
  index: number
  next: number
  type?: EVideoType
  oid: string
  mode?: ESortMode
  uid: string
  pictures: boolean
  regexp: RegExp | null
  offset: string
}

export interface IHandleResult {
  flag: boolean
  // length: number
  extraInfo: {
    next: number
    rp_num: number
    all_count: number
    nextOffset: string
  }
  info: IMatchInfo[]
}

export interface IReplies {
  rcount: number
  mid: number // uid
  member: {
    uname: string
    avatar: string
    level_info: {
      current_level: number
    }
    sex: string
    vip: {
      nickname_color: string
    }
  }
  content: IOriginalInfo
  action: number // 0为无状态 1为已点赞 2为已踩
  like: number // 点赞数量
  count: number
  reply_control: {
    location: string
    sub_reply_entry_text: string
  }
  rpid: number
  ctime: number
}
