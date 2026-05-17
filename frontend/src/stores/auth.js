import { defineStore } from 'pinia';
import api from '../api';
export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  getters: { isAuthed: s => !!s.token },
  actions: {
    async login(payload) {
      const { data } = await api.post('/auth-login', payload);
      this.token = data.token; this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    async register(payload) { return (await api.post('/auth-register', payload)).data; },
    logout() { this.token=''; this.user=null; localStorage.clear(); }
  }
});
