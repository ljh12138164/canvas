<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
import { DropdownMenuItem } from '../ui/dropdown-menu';
const tableSize = ref(['1 x 1', '2 x 2', '3 x 3', '4 x 4']);
const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <TiptopDown
    title="表格"
    :editor="props.editor"
    label="表格"
    icon="mdi:table-plus"
  >
    <template #dropdown>
      <DropdownMenuItem
        v-for="item in tableSize"
        @click="
          props.editor?.commands.insertTable({
            rows: Number(item.split('x')[0]),
            cols: Number(item.split('x')[1]),
            withHeaderRow: false,
          })
        "
        >4 x 4</DropdownMenuItem
      >
    </template>
  </TiptopDown>
</template>

<style scoped></style>
