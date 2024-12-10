<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { fontSizeExtension } from '@/lib/edit';
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';

const props = defineProps<{
  editor: Editor | null;
}>();
const fontSize = ref(
  props.editor?.getAttributes('textStyle').fontSize
    ? props.editor.getAttributes('textStyle').fontSize.replace('px', '')
    : '16',
);
</script>
<template>
  <TiptopDown
    :editor="props.editor"
    :title="fontSize + 'px'"
    label="字号"
    icon="heroicons:chevron-down"
    :height="200"
  >
    <template #dropdown>
      <DropdownMenuItem v-for="item in fontSizeExtension" as-child>
        <Button
          variant="ghost"
          @click="
            () => {
              props.editor?.chain().focus().setFontSize(item.value).run();
              fontSize = item.label;
            }
          "
          class="font-size-item cursor-pointer"
          >{{ item.label }}</Button
        >
      </DropdownMenuItem>
    </template>
  </TiptopDown>
</template>

<style scoped lang="scss">
.font-size-item {
  cursor: pointer;
  width: 100%;
}
</style>
