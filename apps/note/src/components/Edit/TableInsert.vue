<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '../ui/menubar';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>添加表格</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>表格</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem
              @click="
                props.editor?.commands.insertTable({
                  rows: 1,
                  cols: 1,
                  withHeaderRow: false,
                })
              "
              >1 x 1</MenubarItem
            >
            <MenubarItem
              @click="
                props.editor?.commands.insertTable({
                  rows: 2,
                  cols: 2,
                  withHeaderRow: false,
                })
              "
              >2 x 2</MenubarItem
            >
            <MenubarItem
              @click="
                props.editor?.commands.insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: false,
                })
              "
              >3 x 3</MenubarItem
            >
            <MenubarItem
              @click="
                props.editor?.commands.insertTable({
                  rows: 4,
                  cols: 4,
                  withHeaderRow: false,
                })
              "
              >4 x 4</MenubarItem
            >
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>

<style scoped></style>
