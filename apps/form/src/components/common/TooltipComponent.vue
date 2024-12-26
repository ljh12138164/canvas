<script setup lang="ts">
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

defineProps<{
  content: string
  class?: string
  asChild?: boolean
}>()
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <p :class="class">{{ content }}</p>
      </TooltipTrigger>
      <TooltipContent :as-child="asChild || false">
        <p>{{ content }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
