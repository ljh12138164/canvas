<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import TooltipProvider from '../ui/tooltip/TooltipProvider.vue'
defineProps<{
  title: string
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <slot />
      </TooltipTrigger>
      <TooltipContent>
        <p class="text-[0.75rem]">{{ title }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
