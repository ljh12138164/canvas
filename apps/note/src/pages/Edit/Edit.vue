<script setup lang="ts">
import Editor from "@/components/Edit/Tiptap.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { getWorkspaceByIdResponse } from "@/hooks/workspace";
import { Skeleton } from "@/components/ui/skeleton";

const props = defineProps<{
  workspace: getWorkspaceByIdResponse | undefined;
}>();
</script>
<template>
  <div class="editor-wrapper" v-if="props.workspace">
    <ScrollArea class="h-full w-full bg-[rgb(248,250,254)]">
      <Editor :workspace="props.workspace" />
    </ScrollArea>
  </div>
  <div v-else>
    <Skeleton class="h-full w-full" />
  </div>
</template>

<style lang="scss" scoped>
.editor-wrapper {
  height: 100%;
  width: 100%;
}
</style>
