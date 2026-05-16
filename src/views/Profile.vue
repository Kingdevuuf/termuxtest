<template>
  <div class="header"><h1>Profile</h1></div>
  <div class="container">
    <div class="card">
      <h3>{{ auth.user?.name }}</h3>
      <p style="color:#94a3b8;margin-top:6px">{{ auth.user?.email }}</p>
    </div>
    <button class="btn btn-block" @click="logout">Logout</button>
  </div>
  <BottomNav />
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BottomNav from '../components/BottomNav.vue'
const auth = useAuthStore(); const router = useRouter()
function logout(){ auth.logout(); router.push('/login') }
</script>
