<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { LineHeightExtension } from '@/lib/edit';
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
const props = defineProps<{
  editor: Editor | null;
}>();
const lineHeight = ref(props.editor?.getAttributes('paragraph').lineHeight);
</script>
<template>
  <TiptopDown
    title="行高"
    :editor="props.editor"
    label="行高"
    icon="whh:lineheight"
    :height="200"
  >
    <template #dropdown>
      <Button
        v-for="item in LineHeightExtension"
        :key="item.value"
        variant="ghost"
        class="w-full cursor-pointer"
        :class="{
          ' bg-neutral-100': lineHeight === item.value,
        }"
        @click="
          {
            props.editor?.commands.focus();
            console.log(item.value);
            props.editor?.chain().focus().setLineHeight(item.value).run();
            lineHeight = item.value;
          }
        "
      >
        {{ item.label }}
      </Button>
    </template>
  </TiptopDown>
</template>
