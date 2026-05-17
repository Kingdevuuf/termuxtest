<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const data = ref(null), loading=ref(true), bonusOpen=ref(false), testOpen=ref(false);
const testType=ref('30s'), testResult=ref(''), testLoading=ref(false);
const showKey = ref(false);
let chart;
async function load(){ const r = await api.get('/dashboard'); data.value=r.data; loading.value=false; setTimeout(drawChart,50); }
function drawChart(){
  const el = document.getElementById('chart'); if(!el||!data.value) return;
  if(chart) chart.destroy();
  const labels = data.value.chart.map(x=>x.d);
  chart = new Chart(el,{ type:'bar', data:{labels, datasets:[
    {label:'Success', data:data.value.chart.map(x=>+x.ok), backgroundColor:'#16a34a'},
    {label:'Errors',  data:data.value.chart.map(x=>+x.err), backgroundColor:'#ef4444'},
  ]}, options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
}
async function runTest(){
  if(!data.value?.api_key?.api_key) return;
  testLoading.value=true; testResult.value='';
  try { const r = await fetch(`/wingo?type=${testType.value}&api_key=${data.value.api_key.api_key}&domain=test.local`); testResult.value = await r.text(); }
  catch { testResult.value='Error'; }
  testLoading.value=false;
}
const progress = computed(()=>{ const s=data.value?.subscription; if(!s) return 0; const total=(new Date(s.end_date)-new Date(s.start_date))/86400000; const used=(Date.now()-new Date(s.start_date))/86400000; return Math.min(100,Math.max(0,(used/total)*100)); });
onMounted(load);
</script>
<template>
  <div v-if="loading" style="padding:40px;text-align:center">Loading...</div>
  <div v-else>
    <div class="div" style="background:linear-gradient(135deg,#0095f6,#7c3aed);color:#fff;border:0">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="opacity:.8;font-size:12px">{{ data.subscription?.plan?.toUpperCase()||'NO PLAN' }}</div>
          <div style="font-size:22px;font-weight:800">{{ data.today?.ok||0 }} / {{ data.subscription?.daily_limit||0 }}</div>
          <div style="opacity:.8;font-size:11px">today / limit</div>
        </div>
        <button @click="bonusOpen=true" style="background:rgba(255,255,255,.2);border:0;border-radius:50%;width:48px;height:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">
          <img src="/svg/bonus.svg" style="width:22px;filter:invert(1)"/>
          <small style="font-size:9px">₹{{ data.bonus_balance }}</small>
        </button>
      </div>
      <div v-if="data.subscription" style="margin-top:12px">
        <div style="height:6px;background:rgba(255,255,255,.3);border-radius:3px;overflow:hidden">
          <div :style="{width:progress+'%',height:'100%',background:'#fff'}"></div>
        </div>
        <div style="font-size:11px;margin-top:6px;opacity:.9">Expires: {{ data.subscription.end_date }}</div>
      </div>
    </div>

    <div class="div">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <strong>API Key</strong>
        <img :src="showKey?'/svg/show.svg':'/svg/hide.svg'" style="width:18px;cursor:pointer" @click="showKey=!showKey"/>
      </div>
      <code style="display:block;background:#f3f4f6;padding:8px;border-radius:6px;font-size:13px;word-break:break-all">{{ showKey?data.api_key?.api_key:'••••••••••••••' }}</code>
    </div>

    <div class="div">
      <strong>{{ $t('testApi') }}</strong>
      <div style="display:flex;gap:6px;margin:10px 0">
        <select v-model="testType" style="flex:1;padding:8px;border:1px solid #ccc;border-radius:6px">
          <option>30s</option><option>1m</option><option>3m</option><option>5m</option>
        </select>
        <button class="btn" style="width:auto;padding:8px 16px" @click="runTest" :disabled="testLoading">{{ $t('generate') }}</button>
      </div>
      <div v-if="testResult" style="text-align:center;font-size:56px;font-weight:800;color:#0095f6">{{ testResult }}</div>
    </div>

    <div class="div"><strong>Last 7 days</strong><canvas id="chart" height="100" style="margin-top:10px"></canvas></div>

    <div v-if="bonusOpen" class="popup-bg" @click.self="bonusOpen=false">
      <div class="popup">
        <h3>{{ $t('bonus') }} Balance</h3>
        <div style="font-size:36px;font-weight:800;color:#16a34a;text-align:center;margin:14px 0">₹{{ data.bonus_balance }}</div>
        <p style="font-size:13px;color:#666;text-align:center">Earn bonus by referring friends. Bonus credits when your referral subscribes.</p>
        <div class="row"><button class="btn" @click="bonusOpen=false">Close</button></div>
      </div>
    </div>
  </div>
</template>
