<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter, useRoute, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()
</script>
<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">表单</h1>
  </div>
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
    <div class="flex flex-col items-center gap-1 text-center">
      <h3 class="text-2xl font-bold tracking-tight">您没有表单</h3>
      <p class="text-sm text-muted-foreground">添加表单后即可开始使用。</p>
      <Button class="mt-4"> <RouterLink to="/create">创建表单</RouterLink> </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
