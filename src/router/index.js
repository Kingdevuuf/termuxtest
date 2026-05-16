import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Keys from '../views/Keys.vue'
import Subscribe from '../views/Subscribe.vue'
import History from '../views/History.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { auth: true } },
  { path: '/keys', component: Keys, meta: { auth: true } },
  { path: '/subscribe', component: Subscribe, meta: { auth: true } },
  { path: '/history', component: History, meta: { auth: true } },
  { path: '/profile', component: Profile, meta: { auth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.load()
  if (to.meta.auth && !auth.isAuth) return '/login'
  if (to.meta.guest && auth.isAuth) return '/dashboard'
})

export default router
