<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps<{
  editor: Editor | null;
}>();
const fontSize = ref(
  props.editor?.getAttributes("textStyle").fontSize
    ? props.editor.getAttributes("textStyle").fontSize.replace("px", "")
    : "16"
);
const updateFontSize = (newSize: string) => {
  const size = parseInt(newSize);
  if (!isNaN(size) && size > 0) {
    props.editor?.commands.setFontSize({ size: newSize + "px" });
    props.editor?.commands.focus();
    fontSize.value = newSize;
  }
};
</script>
<template>
  <div contenteditable="true" variant="outline" @change="updateFontSize">
    {{ fontSize }}
    <Icon icon="mdi:format-size" />
  </div>
</template>

<style scoped></style>
