<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/TopBar.vue';
import BottomNav from './components/BottomNav.vue';
import { useAuth } from './stores/auth';
const splash = ref(true);
const route = useRoute();
const auth = useAuth();
onMounted(() => setTimeout(() => splash.value = false, 2000));
const showChrome = computed(() => auth.isAuthed && !['/login','/register'].includes(route.path));
</script>
<template>
  <div v-if="splash" class="splash"><img src="/svg/logo.svg" alt="">WINGO</div>
  <TopBar v-if="showChrome"/>
  <router-view />
  <BottomNav v-if="showChrome"/>
</template>
