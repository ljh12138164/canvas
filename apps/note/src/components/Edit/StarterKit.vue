<script setup lang="ts">
import useEditor from '@/store/editor';
import type { Editor } from '@tiptap/vue-3';
import { ScrollArea } from '../ui/scroll-area';
import ScrollBar from '../ui/scroll-area/ScrollBar.vue';
import AddHeader from './AddHeader.vue';
import AlignButton from './AlignButton.vue';
import Color from './Color.vue';
import FontFamily from './FontFamily.vue';
import FontSizeButton from './FontSizeButton.vue';
import HeightColor from './HeightColor.vue';
import Image from './Image.vue';
import KitItem from './KitItem.vue';
import LineHeightButton from './LineHeightButton.vue';
import Link from './Link.vue';
import ListButton from './ListButton.vue';
import TableInsert from './TableInsert.vue';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>

<template>
  <ScrollArea
    class="starter-kit whitespace-nowrap overflow-y-hidden"
    v-if="props.editor"
  >
    <div class="flex items-center gap-1 px-2">
      <div class="flex items-center gap-1 border-r border-gray-200 pr-2">
        <KitItem
          :editor="props.editor"
          v-for="item in useEditor().tiptapKit"
          :key="item.label"
          :iconName="item.icon"
          :isActive="item?.isActive ? item?.isActive(props.editor) : false"
          :onClick="item.onClick"
          :label="item.label"
          :disabled="item.disabled ? item.disabled(props.editor) : false"
        />
      </div>

      <div class="flex items-center gap-1 border-r border-gray-200 pr-2">
        <FontFamily :editor="props.editor" />
        <AddHeader :editor="props.editor" />
        <FontSizeButton :editor="props.editor" />
        <LineHeightButton :editor="props.editor" />
      </div>

      <div class="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Color :editor="props.editor" />
        <HeightColor :editor="props.editor" />
      </div>

      <div class="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Link :editor="props.editor" />
        <Image :editor="props.editor" />
        <TableInsert :editor="props.editor" />
      </div>

      <div class="flex items-center gap-1">
        <AlignButton :editor="props.editor" />
        <ListButton :editor="props.editor" />
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<style scoped lang="scss">
.starter-kit {
  display: flex;
  background-color: white;
  padding: 4px 0;
  align-items: center;
  height: 48px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
  }

  :deep(.scrollbar) {
    height: 4px;
    margin-top: 2px;
  }
}
</style>
