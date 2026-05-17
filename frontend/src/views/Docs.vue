<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
const key = ref('YOUR_API_KEY');
onMounted(async()=>{ try{ const r=await api.post('/api-key',{}); if(r.data?.api_key) key.value=r.data.api_key; }catch{} });
</script>
<template>
  <div style="padding-top:12px">
    <div class="div">
      <h2 style="margin-bottom:10px">API Documentation</h2>
      <p style="color:#666;font-size:13px">Use these endpoints from any website. Replace <code>YOUR_DOMAIN</code> with the domain you approved.</p>
    </div>
    <div class="div">
      <strong>Endpoint</strong>
      <pre style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;margin-top:8px">GET https://termuxtest.vercel.app/wingo?type=1m&api_key={{ key }}&domain=YOUR_DOMAIN</pre>
    </div>
    <div class="div">
      <strong>Parameters</strong>
      <ul style="margin-top:8px;padding-left:18px;font-size:13px;line-height:1.8">
        <li><b>type</b> — 30s | 1m | 3m | 5m</li>
        <li><b>api_key</b> — your unique key</li>
        <li><b>domain</b> — approved domain</li>
      </ul>
    </div>
    <div class="div">
      <strong>Response</strong>
      <pre style="background:#f1f5f9;padding:12px;border-radius:6px;font-size:14px;margin-top:8px">7</pre>
      <small style="color:#666">Returns a single digit 0-9. Returns "0" on any error.</small>
    </div>
    <div class="div">
      <strong>JavaScript Example</strong>
      <pre style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;margin-top:8px">const number = await fetch(
  'https://termuxtest.vercel.app/wingo?type=1m&api_key={{ key }}&domain=mysite.com'
).then(r =&gt; r.text());
console.log(number);</pre>
    </div>
    <div class="div">
      <strong>PHP Example</strong>
      <pre style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;margin-top:8px">$n = file_get_contents(
  'https://termuxtest.vercel.app/wingo?type=1m&api_key={{ key }}&domain=mysite.com'
);
echo $n;</pre>
    </div>
  </div>
</template>
