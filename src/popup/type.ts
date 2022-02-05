export interface IFilter {
  bvid: string
  epid: string
  dyid: string
  keyword: string
  uid: string
  num: string
  searchMode: boolean
  mode: number
}
export interface IView {
  flag: boolean
  reply_total: number
  reply_cur: number
}
export interface IMatchInfo {
  uid: number
  uname: string
  avatar: string
  sex: string
  rpid: number
  message: string
  emote: any
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
    sex: string
    vip: {
      nickname_color: string
    }
  }
  content: {
    message: string
    emote: any
  }
  count: number
  reply_control: {
    sub_reply_entry_text: string
  }
  rpid: number
  ctime: number
}
