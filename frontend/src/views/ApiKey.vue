<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import TextInput from '../components/TextInput.vue';
const k=ref(null), domain=ref(''), show=ref(false), msg=ref('');
async function load(){ const r = await api.post('/api-key',{}); k.value=r.data; domain.value=r.data?.domain||''; }
async function save(){ const r = await api.post('/api-key',{domain:domain.value}); k.value=r.data; msg.value='Saved. Awaiting admin approval.'; setTimeout(()=>msg.value='',2500); }
async function regen(){ if(!confirm('Regenerate key?')) return; const r=await api.post('/api-key',{action:'regenerate'}); k.value=r.data; }
function copy(){ navigator.clipboard.writeText(k.value.api_key); msg.value='Copied!'; setTimeout(()=>msg.value='',1500); }
onMounted(load);
</script>
<template>
  <div v-if="k" style="padding-top:12px">
    <div class="div">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong>{{ $t('apiKey') }}</strong>
        <img :src="show?'/svg/show.svg':'/svg/hide.svg'" style="width:18px;cursor:pointer" @click="show=!show"/>
      </div>
      <code style="display:block;background:#f3f4f6;padding:10px;border-radius:6px;word-break:break-all">{{ show?k.api_key:'••••••••••••••' }}</code>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn ghost" @click="copy">{{ $t('copy') }}</button>
        <button class="btn red" @click="regen">{{ $t('regenerate') }}</button>
      </div>
    </div>
    <TextInput v-model="domain" :label="$t('domain')"/>
    <div style="padding:0 12px;margin-bottom:10px;font-size:12px;color:#666">
      Status: <span class="tag" :class="{yellow:!k.domain_approved,red:!k.domain}">{{ k.domain_approved?'Approved':(k.domain?'Pending':'Not set') }}</span>
    </div>
    <div style="margin:12px"><button class="btn" @click="save">{{ $t('requestDomain') }}</button></div>
    <div v-if="msg" style="text-align:center;color:#16a34a">{{ msg }}</div>
  </div>
</template>
