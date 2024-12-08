<script setup lang="ts">
import { Files } from '@/types/board';

defineProps<{
  isLoading: boolean;
  file: Files;
  isSmall: boolean;
  openFolders: string[];
}>();
</script>
<template>
  <div></div>
</template>
