// time
export const TimestampMS = (date = new Date()): number => +date
export const TimestampSecond = (date = new Date()): number => Math.floor(TimestampMS(date) / 1000)
export const SleepMS = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms))
export const formatTime = (time: number = Date.now() / 1000) => {
  const date = new Date(time * 1000)
  // const [year,month,day,hour,minute] = ['getFullYear','getMonth','getDate','getHours','getMinutes'].map(item => date[item]())
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${month}-${day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
