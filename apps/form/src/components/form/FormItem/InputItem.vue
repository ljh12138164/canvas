<script setup lang="ts">
import type { FormItem } from '@/types/form'

const props = defineProps<{
  data: FormItem
}>()
</script>
<template>
  <div>{{ data }}</div>
</template>

<style lang="scss" scoped></style>
