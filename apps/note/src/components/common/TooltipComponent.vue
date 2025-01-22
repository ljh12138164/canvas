<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

defineProps<{
  content: string;
  class?: string;
  asChild?: boolean;
}>();
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger :as-child="asChild || false">
        <p :class="class">{{ content }}</p>
      </TooltipTrigger>
      <TooltipContent :as-child="asChild || false">
        <p>{{ content }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
