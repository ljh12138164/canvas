<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { onErrorCaptured } from 'vue';
import { RouterView, useRouter } from 'vue-router';
const router = useRouter();
onErrorCaptured(() => {
  router.push('/not-found');
});
</script>
<template>
  <main class="h-[100dvh] overflow-hidden">
    <RouterView />
    <Toaster />
    <VueQueryDevtools />
  </main>
</template>
