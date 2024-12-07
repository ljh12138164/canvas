<script setup lang="ts">
import Editor from '@/components/Edit/Tiptap.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
</script>
<template>
  <ScrollArea class="h-full py-6 bg-[rgb(248,250,254)]">
    <div class="editor">
      <div class="editor-container">
        <Editor />
      </div>
    </div>
  </ScrollArea>
</template>

<style lang="scss" scoped>
.editor {
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
}
</style>
