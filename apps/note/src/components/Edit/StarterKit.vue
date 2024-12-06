<script setup lang="ts">
import useEditor from "@/store/editor";
import { Editor } from "@tiptap/vue-3";
import Separator from "../ui/separator/Separator.vue";
import FontFamily from "./FontFamily.vue";
import AddHeader from "./AddHeader.vue";
import KitItem from "./KitItem.vue";
import Color from "./Color.vue";
import HeightColor from "./HeightColor.vue";
import Link from "./Link.vue";
import Image from "./Image.vue";
import AlignButton from "./AlignButton.vue";
import ListButton from "./ListButton.vue";
import FontSizeButton from "./FontSizeButton.vue";

const props = defineProps<{
  editor: Editor | null;
}>();
</script>

<template>
  <section class="starter-kit" v-if="props.editor">
    <div>
      <KitItem
        :editor="props.editor"
        v-for="item in useEditor().tiptapKit"
        :key="item.label"
        :iconName="item.icon"
        :isActive="item?.isActive ? item?.isActive(props.editor) : false"
        :onClick="item.onClick"
        :label="item.label"
      />
      <Separator orientation="vertical" class="starter-kit-separator" />
    </div>
    <div>
      <FontFamily :editor="props.editor" />
      <AddHeader :editor="props.editor" />
      <Color :editor="props.editor" />
      <HeightColor :editor="props.editor" />
      <Link :editor="props.editor" />
      <Image :editor="props.editor" />
      <AlignButton :editor="props.editor" />
      <ListButton :editor="props.editor" />
      <FontSizeButton :editor="props.editor" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.starter-kit-separator {
  height: 24px;
  background-color: #efeeeed1;
}
.starter-kit {
  display: flex;
  flex-direction: column;
  background-color: #f1f4f9;
  padding: 0.5px 4px;
  border-radius: 24px;
  align-items: center;
  gap: 4px;
}
</style>
