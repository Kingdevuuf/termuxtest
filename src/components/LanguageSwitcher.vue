<template>
  <select class="lang-switcher" :value="locale" @change="change">
    <option v-for="(name, code) in langs" :key="code" :value="code">{{ name }}</option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const langs = { en: 'English', hi: 'हिन्दी', ta: 'தமிழ்', te: 'తెలుగు' }
function change(e){
  locale.value = e.target.value
  localStorage.setItem('lang', e.target.value)
}
</script>

<style scoped>
.lang-switcher{
  padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;font-size:13px;
}
</style>
