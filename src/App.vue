<template>
  <router-view />
</template>
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
onMounted(() => { useAuthStore().load() })
</script>
