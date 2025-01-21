<script setup lang="ts">
import { fontTitle } from '@/lib/edit';
import type { Level } from '@tiptap/extension-heading';
import type { Editor } from '@tiptap/vue-3';
import { computed } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
import { Button } from '../ui/button';

const props = defineProps<{
  editor: Editor | null;
}>();
const headingLevel = computed(() => {
  for (let i = 0; i < fontTitle.length; i++) {
    if (props.editor?.isActive('heading', { level: i })) return `h${i}`;
  }
  return '段落';
});
</script>
<template>
  <TiptopDown
    title="标题"
    :editor="props.editor"
    :label="headingLevel"
    icon="heroicons:chevron-down"
  >
    <template #dropdown>
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
    </template>
  </TiptopDown>
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
