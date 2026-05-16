<template>
  <div class="header"><h1>Wingo Dashboard</h1></div>
  <div class="container">
    <div class="stat-grid">
      <div class="stat"><div class="label">API Keys</div><div class="val">{{ data.api_keys || 0 }}</div></div>
      <div class="stat"><div class="label">Today Calls</div><div class="val">{{ data.today_calls || 0 }}</div></div>
    </div>
    <div class="card">
      <h3>Subscription</h3>
      <div v-if="data.subscription">
        <p>Plan: <strong>{{ data.subscription.plan_name }}</strong></p>
        <p>Valid till: {{ data.subscription.end_date }}</p>
        <p>Status: <span class="badge badge-ok">{{ data.subscription.status }}</span></p>
      </div>
      <div v-else>
        <p style="color:#94a3b8;margin-bottom:10px">No active subscription</p>
        <router-link to="/subscribe" class="btn btn-block">Choose a Plan</router-link>
      </div>
    </div>
    <div class="card">
      <h3>Quick Actions</h3>
      <router-link to="/keys" class="btn btn-block" style="margin-bottom:8px">Manage API Keys</router-link>
      <router-link to="/history" class="btn btn-block">Payment History</router-link>
    </div>
  </div>
  <BottomNav />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import BottomNav from '../components/BottomNav.vue'
const data = ref({})
onMounted(async () => { try { const r = await api.get('/dashboard.php'); data.value = r.data } catch(e) {} })
</script>
