<script setup lang="ts">
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

defineProps<{
  content: string
  class?: string
}>()
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <p :class="class">{{ content }}</p>
      </TooltipTrigger>
      <TooltipContent> {{ content }} </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
