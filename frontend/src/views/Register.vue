<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';
import TextInput from '../components/TextInput.vue';
import PasswordInput from '../components/PasswordInput.vue';
const f=ref({fullname:'',username:'',email:'',password:'',confirm:'',referral_code:''});
const err=ref({}); const loading=ref(false);
const router=useRouter(); const auth=useAuth();
async function submit(){
  err.value={};
  if(!f.value.fullname) err.value.fullname='Required';
  if(!f.value.username) err.value.username='Required';
  if(!/^[^@]+@[^@]+\.[^@]+$/.test(f.value.email)) err.value.email='Invalid email';
  if(f.value.password.length<6) err.value.password='Min 6 chars';
  if(f.value.password!==f.value.confirm) err.value.confirm='Passwords do not match';
  if(Object.keys(err.value).length) return;
  loading.value=true;
  try{ await auth.register(f.value); await auth.login({username:f.value.username,password:f.value.password}); router.push('/dashboard'); }
  catch(e){ err.value.email=e.response?.data?.error||'Failed'; }
  loading.value=false;
}
</script>
<template>
  <div style="padding:60px 12px 30px">
    <h1 style="text-align:center;margin-bottom:30px;font-size:28px;">WINGO</h1>
    <TextInput v-model="f.fullname" label="Full Name" :error="err.fullname"/>
    <TextInput v-model="f.username" label="Username" :error="err.username"/>
    <TextInput v-model="f.email" label="Email" :error="err.email"/>
    <PasswordInput v-model="f.password" label="Password" :error="err.password"/>
    <PasswordInput v-model="f.confirm" label="Confirm Password" :error="err.confirm"/>
    <TextInput v-model="f.referral_code" label="Referral Code (optional)"/>
    <div style="margin:12px"><button class="btn" :disabled="loading" @click="submit">{{ loading?'...':'Register' }}</button></div>
    <p style="text-align:center;margin-top:18px;">Have an account? <router-link to="/login" style="color:#0095f6">Login</router-link></p>
  </div>
</template>
