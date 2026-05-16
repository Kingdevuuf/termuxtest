<template>
  <div class="auth-wrap">
    <form class="auth-card" @submit.prevent="submit">
      <h2>Login</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button :disabled="loading">{{ loading ? 'Please wait...' : 'Login' }}</button>
      <p class="switch">No account? <router-link to="/register">Register</router-link></p>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const email = ref(''), password = ref(''), error = ref(''), loading = ref(false)
const router = useRouter(); const auth = useAuthStore()
async function submit() {
  error.value = ''; loading.value = true
  try { await auth.login(email.value, password.value); router.push('/dashboard') }
  catch (e) { error.value = e.response?.data?.error || 'Login failed' }
  finally { loading.value = false }
}
</script>
