export interface IFilter {
  bvid: string // BV号
  epid: string // 番剧号
  dyid: string // 动态号
  keyword: string // 关键词
  uid: string // b站用户id
  num: string // 限制数量
  searchMode: boolean // 模式（关键词或者正则）
  mode: number // 模式（热度或者时间）
}
export interface IView {
  flag: boolean
  reply_total: number
  reply_cur: number
}

interface IOriginalInfo {
  message: string
  emote: any
  jump_url: {
    [key: string]: { prefix_icon: string, title: string }
  }
  members: {
    mid: string
    uname: string
  }[]
}
export interface IMatchInfo extends IOriginalInfo {
  uid: number
  uname: string
  upper_uid: number
  level: number
  avatar: string
  sex: string
  rpid: number
  time: number
  nickname_color: string
}

export interface ISendPara {
  next: number
  type?: number
  oid: string
  mode?: number
  uid: string
  regexp: RegExp | null
}

export interface IHandleResult {
  flag: boolean
  // length: number
  extraInfo: {
    next: number
    rp_num: number
    all_count: number
  }
  info: IMatchInfo[]
}

export interface IReplies {
  mid: number
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
  count: number
  reply_control: {
    sub_reply_entry_text: string
  }
  rpid: number
  ctime: number
}
