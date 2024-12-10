<script setup lang="ts">
import Editor from '@/components/Edit/Tiptap.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { getWorkspaceByIdResponse } from '@/hooks/workspace';

const props = defineProps<{
  workspace: getWorkspaceByIdResponse | undefined;
}>();
</script>
<template>
  <ScrollArea class="h-full w-full bg-[rgb(248,250,254)]">
    <Editor :workspace="props.workspace" />
  </ScrollArea>
</template>

<style lang="scss" scoped>
/* .editor {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &-container {
    display: flex;
    flex-direction: column;
    max-height: calc(100dvh - 150px);
    min-width: calc(100dvw - 300px);
    max-width: calc(100dvw - 300px);
  }
} */
</style>
