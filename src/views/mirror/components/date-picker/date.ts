import moment from "moment"
import { ref } from "vue"
// 一年每个月的天数
const monthsOfDay: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 当前日期
export const defaultDate = ref<string>(moment().format('YYYY-MM-DD'))
// 转圈数
const loop = ref<number>(0)
// 是否是闰年
const isLeap = (date: string): boolean => {
  const year: number = moment(date).year()
  return year % 4 == 0 && year % 100 != 0 || year % 400 == 0
}
// 一年的天数
const daysOfYear = (date?: string): number => isLeap(date || defaultDate.value) ? 366 : 365
// 当前日期地球位置
export const initEarth = (dateValue: string, or: number) => {
  const dateStr = dateValue || defaultDate.value
  if (dateValue && moment(dateValue).isValid()) {
    defaultDate.value = dateValue
  }
  const [_, month, day]: string[] = dateStr.split('-')
  let days: number = monthsOfDay.slice(0, +month - 1).reduce((pre: number, cur: number) => pre + cur, 0) + +day
  days = isLeap(dateStr) ? days + 1 : days
  const angle: number = days / daysOfYear(dateValue) * Math.PI * 2
  return {
    x: or * Math.sin(angle),
    y: or * Math.cos(angle)
  }
}

// 计算在一年的第几天
export const calcDayOfTheYear = (date: string, angle: number): number => {
  return Math.ceil((daysOfYear(date) / 360) * angle)
}
let lastMonth: number = moment(defaultDate.value).month() + 1
// 计算日期
export const calcDate = (days: number) => {
  let sum: number = 0
  let index: number = -1
  for (let i = 0; i < monthsOfDay.length; i++) {
    let cur: number = monthsOfDay[i]
    // 闰年 2 月 +1 天
    if (isLeap(defaultDate.value) && i === 1) {
      cur += 1
    }
    if (sum + cur >= days) {
      index = i
      break
    } else {
      sum += cur
    }
  }
  const month: number = index + 1
  if (month === 1 && lastMonth === 12) {
    loop.value = 1
    lastMonth = 1
  } else if (month === 12 && lastMonth === 1) {
    loop.value = -1
    lastMonth = 12
  } else {
    lastMonth = month
  }
  const day: number = ((days - sum) % daysOfYear() || 1)
  const year: number = moment(defaultDate.value).year() + loop.value
  loop.value = 0
  defaultDate.value = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  return defaultDate.value
}
