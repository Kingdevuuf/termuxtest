import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: null, user: null }),
  getters: { isAuth: s => !!s.token },
  actions: {
    load() {
      this.token = localStorage.getItem('token')
      try { this.user = JSON.parse(localStorage.getItem('user') || 'null') } catch { this.user = null }
    },
    async login(email, password) {
      const { data } = await api.post('/login.php', { email, password })
      this.setSession(data)
    },
    async register(payload) {
      const { data } = await api.post('/register.php', payload)
      this.setSession(data)
    },
    setSession(data) {
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    logout() {
      this.token = null; this.user = null
      localStorage.removeItem('token'); localStorage.removeItem('user')
    }
  }
})
