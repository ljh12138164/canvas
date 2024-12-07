<script setup lang="ts">
import { fontTitle } from '@/lib/edit';
import type { Level } from '@tiptap/extension-heading';
import type { Editor } from '@tiptap/vue-3';
import { computed } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const props = defineProps<{
  editor: Editor | null;
}>();
const headingLevel = computed(() => {
  for (let i = 0; i < fontTitle.length; i++) {
    if (props.editor?.isActive('heading', { level: i })) {
      return i;
    }
  }
  return 0;
});
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button class="font-family-btn" variant="outline"
        >{{ headingLevel === 0 ? "正文" : `${headingLevel}级标题` }}
        <Icon icon="heroicons:chevron-down" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="font-family-dropdown">
      <Button
        @click="
          () => {
            if (item.value === 0) {
              props.editor?.chain().focus().setParagraph().run();
            } else {
              props.editor
                ?.chain()
                .focus()
                .setHeading({ level: item.value as Level })
                .run();
            }
          }
        "
        v-for="item in fontTitle"
        :key="item.label"
        class="font-family-item"
        variant="ghost"
        :style="{
          fontSize: item.fontSize,
        }"
        :class="{
          active: props.editor?.isActive('heading', {
            level: item.value as Level,
          }),
        }"
        >{{ item.label }}</Button
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped lang="scss">
.font-family-btn {
  height: 30px;
  width: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  &:hover {
    background-color: #e5e5e5d1;
  }
}
.font-family-item {
  height: 30px;
  width: 100px;
  flex-shrink: 0;
  gap: 4px;
  padding: 0 8px;
  border-radius: 4px;
  &:hover {
    background-color: #e5e5e5d1;
  }
}
</style>
