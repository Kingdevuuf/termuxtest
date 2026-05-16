<template>
  <div class="page">
    <h1>{{ t('api_docs') }}</h1>
    <p class="sub">Use your API key to fetch random/deterministic Wingo numbers (0–9).</p>

    <div class="docs-section">
      <h2>Endpoint</h2>
      <p><span class="method">GET</span><span class="endpoint">https://jio-lottery.online/User/api/wingo.php</span></p>
      <p><strong>Parameters:</strong></p>
      <ul style="margin-left:20px;color:#475569;font-size:14px">
        <li><code>type</code> — one of <code>30s, 1m, 3m, 5m</code></li>
        <li><code>api_key</code> — your API key</li>
        <li><code>domain</code> — your whitelisted domain</li>
      </ul>
      <p style="margin-top:10px"><strong>Response:</strong> plain text number 0–9 (or "0" on error).</p>
    </div>

    <div class="docs-section">
      <h2>Code Examples</h2>
      <div class="tabs">
        <button v-for="t in tabs" :key="t" :class="{active:tab===t}" @click="tab=t">{{ t }}</button>
      </div>
      <div class="code-block"><pre>{{ samples[tab] }}</pre></div>
    </div>

    <div class="docs-section">
      <h2>Live Tester</h2>
      <div class="tester">
        <select v-model="testType">
          <option>30s</option><option>1m</option><option>3m</option><option>5m</option>
        </select>
        <input v-model="testKey" placeholder="api_key">
        <input v-model="testDomain" placeholder="domain">
        <button @click="runTest">Test</button>
        <div v-if="result!==null" class="result">→ {{ result }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import '../assets/css/apidocs.css'

const { t } = useI18n()
const tabs = ['JavaScript','PHP','Python','cURL']
const tab = ref('JavaScript')
const testType = ref('30s'), testKey = ref(''), testDomain = ref(''), result = ref(null)

const samples = computed(() => ({
  JavaScript: `fetch('https://jio-lottery.online/User/api/wingo.php?type=1m&api_key=YOUR_KEY&domain=site.com')
  .then(r => r.text())
  .then(num => console.log('Wingo:', num))`,
  PHP: `<?php
$num = file_get_contents('https://jio-lottery.online/User/api/wingo.php?type=1m&api_key=YOUR_KEY&domain=site.com');
echo $num;`,
  Python: `import requests
r = requests.get('https://jio-lottery.online/User/api/wingo.php',
                 params={'type':'1m','api_key':'YOUR_KEY','domain':'site.com'})
print(r.text)`,
  cURL: `curl "https://jio-lottery.online/User/api/wingo.php?type=1m&api_key=YOUR_KEY&domain=site.com"`
}))

async function runTest(){
  const url = `https://jio-lottery.online/User/api/wingo.php?type=${testType.value}&api_key=${encodeURIComponent(testKey.value)}&domain=${encodeURIComponent(testDomain.value)}`
  try {
    const r = await fetch(url)
    result.value = await r.text()
  } catch (e) {
    result.value = 'Error: ' + e.message
  }
}
</script>
