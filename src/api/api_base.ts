import axios from 'axios'

const Axios = axios.create({
  timeout: 20000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

//POST传参序列化(添加请求拦截器)
// Axios.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     // error 的回调信息
//     return Promise.reject(error.data.error.message)
//   }
// )

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  (res) => {
    if (res.data.code) {
      throw new Error(res.data.message)
    }
    return res.data
  },
  (error) => {
    throw new Error((error as Error).message)
  }
)

export default Axios
