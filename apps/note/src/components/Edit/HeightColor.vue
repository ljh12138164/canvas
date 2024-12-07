<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { debounce } from 'lodash';
import { watch } from 'vue';
import { defineProps, ref } from 'vue';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const props = defineProps<{
  editor: Editor | null;
}>();

const color = ref(props.editor?.getAttributes('highlight').color || '#000000');
watch(
  color,
  debounce((newVal: string) => {
    props.editor?.chain().focus().toggleHighlight({ color: newVal }).run();
  }, 100),
);
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button class="font-family-btn" variant="outline">
        <span>高亮</span>
        <Icon icon="heroicons:chevron-down" />
        <div class="h-0.5 w-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent asChild>
      <v-color-picker v-model="color" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped lang="scss"></style>
