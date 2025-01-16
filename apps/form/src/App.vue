<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
<template>
  <RouterView />
  <Toaster />
  <VueQueryDevtools />
</template>
