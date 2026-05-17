<script setup>
const items = [
  ['Home','/dashboard','home'],
  ['Key','/api-key','key'],
  ['Subscribe','/subscribe','money'],
  ['History','/history','history'],
  ['Docs','/docs','docs'],
  ['Profile','/profile','user'],
];
</script>
<template>
  <nav style="position:fixed;bottom:0;left:0;right:0;height:64px;background:#fff;border-top:1px solid #ccc;display:flex;justify-content:space-around;align-items:center;z-index:10;max-width:480px;margin:0 auto;">
    <router-link v-for="[label,to,icon] in items" :key="to" :to="to" style="display:flex;flex-direction:column;align-items:center;gap:2px;color:#666;font-size:10px;" active-class="active">
      <img :src="`/svg/${icon}.svg`" style="width:22px;height:22px"/>
      {{ label }}
    </router-link>
  </nav>
</template>
<style>
.active { color: #0095f6 !important; }
.active img { filter: invert(50%) sepia(99%) saturate(2000%) hue-rotate(180deg); }
</style>
