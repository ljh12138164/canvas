<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import type { Editor } from "@tiptap/vue-3";
import { ref } from "vue";

const props = defineProps<{
  editor: Editor | null;
}>();
const fontSize = ref(
  props.editor?.getAttributes("textStyle").fontSize
    ? props.editor.getAttributes("textStyle").fontSize.replace("px", "")
    : "16"
);
const input = ref<HTMLInputElement | null>(null);
const updateFontSize = (newSize: number) => {
  const size = newSize;
  // if (size === "") {
  //   props.editor?.chain().focus().setFontSize("16px").run();
  //   // props.editor?.commands.focus();
  //   fontSize.value = "16";
  //   return;
  // }
  if (size <= 0) {
    props.editor?.chain().focus().setFontSize("1px").run();
    // props.editor?.commands.focus();
    fontSize.value = "1";
    return;
  }
  if (size > 100) {
    props.editor?.chain().focus().setFontSize("100px").run();
    // props.editor?.commands.focus();
    fontSize.value = "100";
    return;
  }

  if (!isNaN(size) && size > 0) {
    props.editor
      ?.chain()
      .focus()
      .setFontSize(size + "px")
      .run();
    fontSize.value = size.toString();
    input.value?.focus();
    return;
    // props.editor?.commands.focus();
  }
};
</script>
<template>
  <div class="flex items-center gap-2">
    <Button variant="outline" @click="updateFontSize(Number(fontSize) - 1)">
      <Icon class="w-4 h-4" icon="mdi:minus" />
    </Button>
    <input
      ref="input"
      min="1"
      class="w-20"
      type="number"
      v-model="fontSize"
      @input="updateFontSize(Number($event.target?.value!))"
    />
    <Button variant="outline" @click="updateFontSize(Number(fontSize) + 1)">
      <Icon class="w-4 h-4" icon="mdi:plus" />
    </Button>
  </div>
</template>
