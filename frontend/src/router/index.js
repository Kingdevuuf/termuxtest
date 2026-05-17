import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../stores/auth';
const r = (p, c) => ({ path: p, component: () => import(`../views/${c}.vue`) });
const routes = [
  { path: '/', redirect: '/dashboard' },
  r('/login', 'Login'), r('/register', 'Register'),
  { ...r('/dashboard','Dashboard'), meta:{auth:true} },
  { ...r('/api-key','ApiKey'), meta:{auth:true} },
  { ...r('/subscribe','Subscribe'), meta:{auth:true} },
  { ...r('/history','History'), meta:{auth:true} },
  { ...r('/docs','Docs'), meta:{auth:true} },
  { ...r('/profile','Profile'), meta:{auth:true} },
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  const a = useAuth();
  if (to.meta.auth && !a.isAuthed) return '/login';
  if (!to.meta.auth && a.isAuthed && ['/login','/register'].includes(to.path)) return '/dashboard';
});
export default router;
