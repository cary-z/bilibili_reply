export interface IFilter {
  bvid: string
  keyword: string
  uid: string
  num: string
  mode: boolean
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
  time: number
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
  length: number
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
  }
  content: {
    message: string
  }
  reply_control: {
    sub_reply_entry_text: string
  }
  rpid: number
  ctime: number
}
