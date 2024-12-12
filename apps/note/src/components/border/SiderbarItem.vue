<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>
<template>
  <Button variant="ghost" class="w-full h-10 bg-muted">
    <slot></slot>
  </Button>
</template>
