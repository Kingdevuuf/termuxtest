<script setup>
import { ref } from 'vue';
const props = defineProps({ modelValue:String, label:String, error:String });
defineEmits(['update:modelValue']);
const show = ref(false);
</script>
<template>
  <div>
    <div class="input-wrap" :class="{error}">
      <input :type="show?'text':'password'" :value="modelValue" @input="$emit('update:modelValue',$event.target.value)" placeholder=" "/>
      <label>{{ label }}</label>
      <img :src="show?'/svg/show.svg':'/svg/hide.svg'" class="eye" @click="show=!show"/>
    </div>
    <div v-if="error" class="error-line">{{ error }}</div>
  </div>
</template>
