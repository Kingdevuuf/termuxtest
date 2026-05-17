<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
const logs=ref([]), loading=ref(true);
async function load(){ const r = await api.get('/history'); logs.value=r.data.logs; loading.value=false; }
onMounted(load);
</script>
<template>
  <div style="padding-top:12px">
    <div v-if="loading" style="text-align:center;padding:40px">Loading...</div>
    <div v-else>
      <div v-for="l in logs" :key="l.created_at+l.ip" class="div" style="padding:10px 14px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:22px;color:#0095f6">{{ l.result }}</strong>
          <span class="tag">{{ l.endpoint }}</span>
        </div>
        <div style="font-size:11px;color:#666;margin-top:4px">{{ l.domain }} · {{ l.ip }} · {{ l.created_at }}</div>
      </div>
      <div v-if="!logs.length" style="text-align:center;padding:40px;color:#888">No history yet</div>
    </div>
  </div>
</template>
