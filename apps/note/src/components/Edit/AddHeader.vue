<script setup lang="ts">
import { fontTitle } from "@/lib/edit";
import useEditor from "@/store/editor";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { type Level } from "@tiptap/extension-heading";
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button class="font-family-btn" variant="outline"
        >{{ useEditor().fontTitle }}
        <Icon icon="heroicons:chevron-down" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="font-family-dropdown">
      <Button
        @click="
          () => {
            if (item.value === 0) {
              useEditor()?.editorData.chain().focus().setParagraph().run();
            } else {
              useEditor()
                ?.editorData.chain()
                .focus()
                .setHeading({ level: item.value as Level })
                .run();
            }
          }
        "
        v-for="item in fontTitle"
        :key="item.label"
        class="font-family-item"
        variant="ghost"
        :style="{
          fontSize: item.fontSize,
        }"
        :class="{
          active: useEditor().fontFamily === item.value,
        }"
        >{{ item.label }}</Button
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped lang="scss">
.font-family-btn {
  height: 30px;
  width: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  &:hover {
    background-color: #e5e5e5d1;
  }
}
.font-family-item {
  height: 30px;
  width: 100px;
  flex-shrink: 0;
  gap: 4px;
  padding: 0 8px;
  border-radius: 4px;
  &:hover {
    background-color: #e5e5e5d1;
  }
}
</style>
