<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { align } from '@/lib/edit';
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import TiptopDown from '../common/TiptopDown.vue';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <TiptopDown
    title="对齐方式"
    :editor="props.editor"
    label="对齐方式"
    icon="lucide:align-center"
    :height="200"
  >
    <template #dropdown>
      <Button
        v-for="item in align"
        :key="item.value"
        variant="ghost"
        class="w-full cursor-pointer"
        :class="{
          ' bg-neutral-100': props.editor?.isActive({
            textAlign: item.value,
          }),
        }"
        @click="props.editor?.chain().focus().setTextAlign(item.value).run()"
      >
        <Icon :icon="item.iconName" />
        {{ item.label }}
      </Button>
    </template>
  </TiptopDown>
</template>

<style scoped></style>
