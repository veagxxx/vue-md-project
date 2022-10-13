import { ElMessage } from 'element-plus';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
interface AxiosConfig {
  baseURL: string;
  timeout: number;
}
const config: AxiosConfig = {
  baseURL: 'http://localhost:9000/api',
  timeout: 3000000,
}

const instance: AxiosInstance = axios.create(config)
// 拦截
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status == 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  (error: any) => {
    // console.log('error', error)
    if (error && error.message === 'Network Error') {
      ElMessage.error('网络错误，请检查你的网络')
    }
    return Promise.reject()
  }
)


export default instance