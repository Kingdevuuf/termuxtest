<template>
  <div class="header"><h1>API Keys</h1></div>
  <div class="container">
    <div class="card">
      <h3>Generate New Key</h3>
      <input v-model="domain" placeholder="yourdomain.com" style="width:100%;padding:10px;background:#0f172a;border:1px solid #334155;color:#e2e8f0;border-radius:8px;margin-bottom:10px" />
      <button class="btn btn-block" @click="generate" :disabled="loading">{{ loading?'Generating...':'Generate API Key' }}</button>
    </div>
    <div class="card">
      <h3>Your Keys</h3>
      <div v-for="k in keys" :key="k.id" style="margin-bottom:10px;padding:10px;background:#0f172a;border-radius:8px">
        <code>{{ k.api_key }}</code>
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12px;color:#94a3b8">
          <span>{{ k.domain }}</span>
          <span :class="'badge ' + (k.approved?'badge-ok':'badge-pending')">{{ k.approved?'Approved':'Pending' }}</span>
        </div>
      </div>
      <p v-if="!keys.length" style="color:#94a3b8;text-align:center">No keys yet</p>
    </div>
  </div>
  <BottomNav />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import BottomNav from '../components/BottomNav.vue'
const keys = ref([]), domain = ref(''), loading = ref(false)
async function load(){ const r = await api.get('/keys.php'); keys.value = r.data.keys || [] }
async function generate(){
  if(!domain.value) return alert('Enter domain')
  loading.value = true
  try { await api.post('/keys.php', { domain: domain.value }); domain.value=''; await load() }
  catch(e){ alert(e.response?.data?.error || 'Failed') }
  finally { loading.value=false }
}
onMounted(load)
</script>
