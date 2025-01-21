<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { RouterView } from 'vue-router';
</script>
<template>
  <RouterView />
  <Toaster />
  <VueQueryDevtools />
</template>
