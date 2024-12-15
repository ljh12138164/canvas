<script setup lang="ts">
import type { FormItem } from '@/types/form'
import InputItem from './FormItem/InputItem.vue'

defineProps<{
  id: string
  list: FormItem[]
  data: FormItem | undefined
}>()
</script>
<template>
  <div v-if="data">
    <div v-if="data.type === 'input'">
      <InputItem :data="data" />
    </div>
    <div v-else-if="data.type === 'select'"></div>
    <div v-else-if="data.type === 'checkbox'"></div>
    <div v-else-if="data.type === 'radio'"></div>
    <div v-else-if="data.type === 'textarea'"></div>
    <div v-else-if="data.type === 'date'"></div>
    <div v-else-if="data.type === 'datetime'"></div>
    <div v-else-if="data.type === 'time'"></div>
    <div v-else-if="data.type === 'number'"></div>
    <div v-else-if="data.type === 'integer'"></div>
    <div v-else-if="data.type === 'float'"></div>
    <div v-else-if="data.type === 'boolean'"></div>
  </div>
</template>
