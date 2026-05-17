<script setup>
defineProps({ modelValue:String, label:String, error:String, type:{type:String,default:'text'} });
defineEmits(['update:modelValue']);
</script>
<template>
  <div>
    <div class="input-wrap" :class="{error}">
      <input :type="type" :value="modelValue" @input="$emit('update:modelValue',$event.target.value)" placeholder=" "/>
      <label>{{ label }}</label>
    </div>
    <div v-if="error" class="error-line">{{ error }}</div>
  </div>
</template>
