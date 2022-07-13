// 路由名称校验
export const checkRouterName = (rule: any, value: any, callback: any) => {
  if (value == '') {
    callback(new Error('请输入路由名称'))
  } else {
    callback()
  }
}
// 访问路径校验
export const checkRouterPath = (rule: any, value: any, callback: any) => {
  if (value == '') {
    callback(new Error('请输入访问'))
  } else {
    if (!isValidPath(value)) {
      callback(new Error('访问路径格式错误'))
    }
    callback()
  }
}
// 访问路径格式校验
const isValidPath = (path: string) => {
  // 路径校验
  const start: RegExp = new RegExp(/^\/[a-z|A-Z]+[0-9]?[a-z|A-Z]?/, "g")
  // 中文校验
  const zhTest: RegExp = new RegExp("[\\u4E00-\\u9FFF]+", "g")
  // 多 / 校验
  const multi: boolean = path.split('').filter((item: string) => item == '/').length > 1
  return start.test(path) && !zhTest.test(path) && !multi
}