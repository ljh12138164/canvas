<script setup lang="ts">
import { RouterLink } from 'vue-router'
const props = defineProps<{
  title: string
  path: string
  active: boolean
}>()
const emit = defineEmits(['click'])
const handleClick = () => {
  emit('click', props.path)
}
</script>
<template>
  <RouterLink
    @click="handleClick"
    :to="props.path"
    variant="ghost"
    :class="{
      'text-black border-l-2 border-[#0a0a6f] bg-[#f5f5f5] dark:bg-black/35 dark:text-white':
        props.active,
    }"
    class="flex text-left items-center gap-3 hover:bg-[#f5f5f5] dark:hover:bg-black/35 h-12 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
  >
    <slot name="icon" />
    <span class="text-sm text-left">{{ props.title }}</span>
  </RouterLink>
</template>
