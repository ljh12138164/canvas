<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { debounce } from 'lodash';
import { watch } from 'vue';
import { defineProps, ref } from 'vue';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
const props = defineProps<{
  editor: Editor | null;
}>();

const color = ref(props.editor?.getAttributes('textStyle').color || '#000000');
watch(
  color,
  debounce((newVal: string) => {
    props.editor?.chain().focus().setColor(newVal).run();
  }, 100)
);
</script>
<template>
  <TiptopDown
    title="字体颜色"
    :editor="props.editor"
    label="字体颜色"
    icon="lucide:palette"
  >
    <template #dropdown>
      <v-color-picker v-model="color" />
    </template>
  </TiptopDown>
</template>

<style scoped lang="scss"></style>
