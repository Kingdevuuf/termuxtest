<template>
  <div class="header"><h1>Subscription Plans</h1></div>
  <div class="container">
    <div class="card" v-for="p in plans" :key="p.id">
      <div class="plan">
        <div class="info">
          <h4>{{ p.name }}</h4>
          <p>{{ p.days }} days · {{ p.daily_limit }} calls/day</p>
        </div>
        <div class="price">₹{{ p.price }}</div>
      </div>
      <button class="btn btn-block btn-success" @click="subscribe(p)" :disabled="loadingId===p.id">
        {{ loadingId===p.id ? 'Redirecting...' : 'Subscribe & Pay' }}
      </button>
    </div>
  </div>
  <BottomNav />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import BottomNav from '../components/BottomNav.vue'
const plans = ref([]); const loadingId = ref(null)
onMounted(async () => { const r = await api.get('/plans.php'); plans.value = r.data.plans || [] })
async function subscribe(p) {
  loadingId.value = p.id
  try {
    const { data } = await api.post('/subscribe.php', { plan_id: p.id })
    // redirect user to payment gateway with details
    window.location.href = data.redirect_url
  } catch (e) {
    alert(e.response?.data?.error || 'Subscription failed')
    loadingId.value = null
  }
}
</script>
