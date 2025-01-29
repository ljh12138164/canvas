<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { debounce } from 'lodash-es';
import { ref, watch } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';

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
  <TiptopDown title="字体高亮" :editor="props.editor" label="字体高亮" icon="ant-design:highlight-outlined" :height="200">
    <template #dropdown>
      <v-color-picker v-model="color" />
    </template>
  </TiptopDown>
</template>

<style scoped lang="scss"></style>
