import { IParam } from "@/types";
import axios from "axios";
import { ElMessage } from "element-plus";
import http from '@/utils/axios'
// 上传 .md 文件
export const uploadMdFile = (params: IParam) => {
  const { fileString, fileName, routerName, routerPath } = params
  return new Promise((resolve, reject) => {
    http.post(
      '/write', 
      { file: fileString, fileName, routerName, routerPath }
    ).then(res => {
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

/**
 * 下载文件
 * @param params 
 * @returns 
 */
export const downloadFileApi = (params: any) => {
  return new Promise((resolve, reject) => {
    http.get('/download', { params: params, responseType: 'blob' })
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}