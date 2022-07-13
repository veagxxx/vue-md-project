import { IParam } from "@/types";
import axios from "axios";
import { ElMessage } from "element-plus";
// 上传 .md 文件
export const uploadMdFile = (params: IParam) => {
  const { fileString, fileName, routerName, routerPath } = params
  return new Promise((resolve, reject) => {
    axios.post(
      'http://localhost:9088/write', 
      { file: fileString, fileName, routerName, routerPath }
    ).then(res => {
      if (res.data.code == 200) {
        ElMessage.success('上传成功')
      } else {
        ElMessage.success('上传失败')
      }
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
}
/**
 * 获取路由菜单
 * @returns 
 */
export const getMenus = () => {
  return new Promise((resolve, reject) => {
    axios.get('src/menus/path.json')
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
}