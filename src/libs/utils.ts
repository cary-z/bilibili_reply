export const TimestampMS = (date = new Date()): number => (+date)
export const TimestampSecond = (date = new Date()): number => Math.floor(TimestampMS(date) / 1000)
export const SleepMS = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms))