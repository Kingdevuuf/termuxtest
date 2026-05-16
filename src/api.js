import axios from 'axios'

// CHANGE THIS to your cPanel URL
export const API_BASE = 'https://jio-lottery.online/User/api'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  e => {
    if (e.response && e.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        location.href = '/login'
      }
    }
    return Promise.reject(e)
  }
)

export default api
