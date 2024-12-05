<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { fontFamily } from "@/lib/edit";
import { Icon } from "@iconify/vue";
import useEditor from "@/store/editor";
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button class="font-family-btn" variant="outline"
        >{{ useEditor().fontFamily }}
        <Icon icon="heroicons:chevron-down" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="font-family-dropdown">
      <Button
        @click="
          useEditor()
            ?.editorData.chain()
            .focus()
            .setFontFamily(item.value)
            .run()
        "
        v-for="item in fontFamily"
        :key="item.label"
        class="font-family-item"
        variant="ghost"
        :style="{
          fontFamily: item.value,
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
.active {
  background-color: #e5e5e5d1;
}
.font-family-dropdown {
  padding: 4px;
  gap: 4px;
}
</style>
