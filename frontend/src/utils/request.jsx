import axios from 'axios'
// import router from '@/router'
// import { message } from 'antd'

/**
 * axois encapsulation
 * 1. base url
 * 2. timeout
 * 3. request
 **/

const request = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_PRODUCT_ENV,   
  baseURL: import.meta.env.VITE_BACKEND_PROD_ENV,
  // withCredentials: true,
  timeout: 60000, // 60s
})

// Intercept response bofore return to client side, handle with response data
// request.interceptors.response.use((response) => {
//   return response.data
// }, (error) => {
//   console.dir(error)
//   if (error.response.status === 401) {
//     router.navigate('/dashboard/login')
//     window.location.reload()
//   }
//   else if (error.response.statis === 403) {
//     router.navigate('/dashboard/login')
//     message.warning('Your session has expired. Please log in again to continue.')
//     window.location.reload()
//   }
//   return Promise.reject(error)
// })

export { request }