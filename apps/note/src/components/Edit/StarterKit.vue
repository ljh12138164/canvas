<script setup lang="ts">
import useEditor from "@/store/editor";
import { Editor } from "@tiptap/vue-3";
import Separator from "../ui/separator/Separator.vue";
import FontFamily from "./FontFamily.vue";
import AddHeader from "./AddHeader.vue";
import KitItem from "./KitItem.vue";
</script>

<template>
  <section class="starter-kit">
    <KitItem
      v-for="item in useEditor().tiptapKit"
      :key="item.label"
      :iconName="item.icon"
      :isActive="item?.isActive"
      :onClick="item.onClick"
      :label="item.label"
    />
    <Separator orientation="vertical" class="starter-kit-separator" />
    <FontFamily :editorData="useEditor().editorData as Editor | null" />
    <AddHeader :editorData="useEditor().editorData as Editor | null" />
  </section>
</template>

<style scoped lang="scss">
.starter-kit-separator {
  height: 24px;
  background-color: #efeeeed1;
}
.starter-kit {
  display: flex;
  background-color: #f1f4f9;
  padding: 0.5px 4px;
  border-radius: 24px;
  align-items: center;
  gap: 4px;
}
</style>
