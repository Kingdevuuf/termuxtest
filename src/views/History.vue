<template>
  <div class="header"><h1>Payment History</h1></div>
  <div class="container">
    <div class="card">
      <table>
        <tr><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr>
        <tr v-for="h in history" :key="h.id">
          <td>{{ h.plan }}</td>
          <td>₹{{ h.amount }}</td>
          <td><span :class="'badge ' + statusClass(h.status)">{{ h.status }}</span></td>
          <td>{{ h.created_at?.slice(0,10) }}</td>
        </tr>
      </table>
      <p v-if="!history.length" style="color:#94a3b8;text-align:center;padding:20px">No payments yet</p>
    </div>
  </div>
  <BottomNav />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import BottomNav from '../components/BottomNav.vue'
const history = ref([])
function statusClass(s){ return s==='success'?'badge-ok':s==='failed'?'badge-fail':'badge-pending' }
onMounted(async () => { const r = await api.get('/payment_history.php'); history.value = r.data.history || [] })
</script>
