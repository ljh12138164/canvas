<script setup lang="ts">
import type { FormItem } from '@/types/form'

defineProps<{
  id: string
  list: FormItem[]
  data: FormItem | undefined
}>()
</script>
<template>
  <div v-if="data">
    <div>{{ data }}</div>
    <div>{{ list }}</div>
  </div>
</template>
