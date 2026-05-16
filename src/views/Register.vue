<template>
  <div class="auth-wrap">
    <form class="auth-card" @submit.prevent="submit">
      <h2>Create Account</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <input v-model="name" type="text" placeholder="Full Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="phone" type="tel" placeholder="Phone (optional)" />
      <input v-model="password" type="password" placeholder="Password (min 6)" required minlength="6" />
      <button :disabled="loading">{{ loading ? 'Please wait...' : 'Register' }}</button>
      <p class="switch">Already have account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const name=ref(''),email=ref(''),phone=ref(''),password=ref(''),error=ref(''),loading=ref(false)
const router=useRouter(); const auth=useAuthStore()
async function submit(){
  error.value=''; loading.value=true
  try { await auth.register({ name:name.value, email:email.value, phone:phone.value, password:password.value }); router.push('/dashboard') }
  catch(e){ error.value = e.response?.data?.error || 'Registration failed' }
  finally { loading.value=false }
}
</script>
