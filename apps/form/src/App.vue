<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <RouterView></RouterView>
  <VueQueryDevtools />
</template>
