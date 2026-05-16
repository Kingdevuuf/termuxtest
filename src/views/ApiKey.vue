<template>
  <div class="page">
    <h1>{{ t('your_api_key') }}</h1>
    <div class="key-card">
      <div class="label">API Key</div>
      <div class="key-row">
        <code>{{ data.api_key || '...' }}</code>
        <button class="copy-btn" @click="copy">{{ copied? t('copied') : t('copy') }}</button>
      </div>
    </div>
    <div class="section">
      <h2>{{ t('domain_whitelist') }}
        <span v-if="data.domain" class="badge" :class="data.domain_approved? 'ok':'pending'">
          {{ data.domain_approved? t('approved') : t('pending') }}
        </span>
      </h2>
      <input v-model="domain" :placeholder="t('your_domain')">
      <button @click="save">{{ t('request_approval') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '../stores/auth'
import '../assets/css/apikey.css'

const { t } = useI18n()
const data = ref({})
const domain = ref('')
const copied = ref(false)

async function load(){
  const r = await api.get('/api-key.php')
  data.value = r.data
  domain.value = r.data.domain || ''
}
async function save(){
  await api.post('/api-key.php', { domain: domain.value })
  await load()
}
function copy(){
  navigator.clipboard.writeText(data.value.api_key || '')
  copied.value = true
  setTimeout(()=>copied.value=false, 1500)
}
onMounted(load)
</script>
