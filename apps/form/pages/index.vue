<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>

<template>
  <Toaster />
  <NuxtPage />
  <VueQueryDevtools position="bottom" />
</template>
