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
    <!-- 字体 -->
    <FontFamily :editor="props.editor" />
    <!-- 标题 -->
    <AddHeader :editor="props.editor" />
    <!-- 颜色 -->
    <Color :editor="props.editor" />
    <!-- 高亮 -->
    <HeightColor :editor="props.editor" />
    <!-- 链接 -->
    <Link :editor="props.editor" />
    <!-- 图片 -->
    <Image :editor="props.editor" />
    <!-- 对齐 -->
    <AlignButton :editor="props.editor" />
    <!-- 列表 -->
    <ListButton :editor="props.editor" />
    <!-- 字体大小 -->
    <FontSizeButton :editor="props.editor" />
    <!-- 行高 -->
    <LineHeightButton :editor="props.editor" />
    <!-- 表格 -->
    <TableInsert :editor="props.editor" />
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<style scoped lang="scss">
.starter-kit-separator {
  // height: ;
  background-color: #efeeeed1;
  overflow-x: scroll;
}
.starter-kit {
  display: flex;
  background-color: white;
  padding: 0.5px 4px;
  align-items: center;
  overflow-x: scroll;
  height: 45px;
  gap: 4px;
  overflow-y: hidden;
}
</style>
