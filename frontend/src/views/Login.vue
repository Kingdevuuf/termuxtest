<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';
import TextInput from '../components/TextInput.vue';
import PasswordInput from '../components/PasswordInput.vue';
const u=ref(''),p=ref(''),err=ref(''),loading=ref(false);
const router=useRouter(); const auth=useAuth();
async function submit(){ err.value=''; loading.value=true; try{ await auth.login({username:u.value,password:p.value}); router.push('/dashboard'); }catch(e){ err.value=e.response?.data?.error||'Login failed'; } loading.value=false; }
</script>
<template>
  <div style="padding:60px 12px 0">
    <h1 style="text-align:center;margin-bottom:30px;font-size:28px;">WINGO</h1>
    <TextInput v-model="u" label="Username or Email"/>
    <PasswordInput v-model="p" label="Password" :error="err"/>
    <div style="margin:12px"><button class="btn" :disabled="loading" @click="submit">{{ loading?'...':'Login' }}</button></div>
    <p style="text-align:center;margin-top:18px;">No account? <router-link to="/register" style="color:#0095f6">Register</router-link></p>
  </div>
</template>
