<script setup>
import { ref } from 'vue';
import api from '../api';
const plans=[{k:'basic',price:499,limit:'1,000/day'},{k:'pro',price:999,limit:'5,000/day'},{k:'enterprise',price:1999,limit:'Unlimited'}];
const refc=ref(''), result=ref(null), loading=ref(false);
async function subscribe(p){ loading.value=true; try{ const r = await api.post('/subscribe',{plan:p,referral_code:refc.value||null}); result.value=r.data; }catch(e){ alert(e.response?.data?.error||'Failed'); } loading.value=false; }
</script>
<template>
  <div style="padding-top:12px">
    <h2 style="text-align:center;margin:14px">Choose Plan</h2>
    <div v-for="p in plans" :key="p.k" class="div" style="background:linear-gradient(135deg,#0095f6,#7c3aed);color:#fff;border:0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-size:18px;font-weight:800;text-transform:uppercase">{{ p.k }}</div><div style="opacity:.8;font-size:12px">{{ p.limit }}</div></div>
        <div style="font-size:24px;font-weight:800">₹{{ p.price }}</div>
      </div>
      <button class="btn" style="background:#fff;color:#0095f6;margin-top:12px" @click="subscribe(p.k)" :disabled="loading">{{ $t('payNow') }}</button>
    </div>
    <div style="margin:12px"><input v-model="refc" placeholder="Referral Code (optional)" style="width:100%;padding:12px;border:1px solid #ccc;border-radius:8px"/></div>
    <div v-if="result" class="popup-bg" @click.self="result=null">
      <div class="popup">
        <h3>Payment Request</h3>
        <p>ID: <code>{{ result.payment_id }}</code></p>
        <p>Amount: ₹{{ result.amount }} <small v-if="result.discount>0">(Discount ₹{{ result.discount }})</small></p>
        <p style="margin-top:10px;font-size:13px;color:#666">Contact admin with this Payment ID. Plan activates after admin approval.</p>
        <div class="row"><button class="btn" @click="result=null">OK</button></div>
      </div>
    </div>
  </div>
</template>
