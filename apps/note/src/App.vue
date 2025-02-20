<script setup lang="ts">
import { Toast } from '@/components/ui/toast';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>
<template>
  <main>
    <RouterView />
    <VueQueryDevtools />
    <Toast />
  </main>
</template>
<style lang="scss">
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 90%;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
}

body {
  height: 100%;
  width: 100%;
}

#root {
  height: 100%;
  width: 100%;
}
</style>
