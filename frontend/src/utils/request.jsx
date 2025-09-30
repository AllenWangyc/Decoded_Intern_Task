import axios from 'axios'

/**
 * axois encapsulation
 * 1. baseURL
 * 2. timeout
 * 3. request
 **/

const request = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_PRODUCT_ENV,   
  baseURL: import.meta.env.VITE_BACKEND_PROD_ENV,
  timeout: 60000, // 60s
})

export { request }