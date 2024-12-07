<script setup lang="ts">
import { fontFamily } from '@/lib/edit';
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button class="font-family-btn" variant="outline"
        >{{
          props.editor?.isActive("textStyle", {
            fontFamily: "Arial",
          })
        }}
        <Icon icon="heroicons:chevron-down" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="font-family-dropdown">
      <Button
        @click="props.editor?.chain().focus().setFontFamily(item.value).run()"
        v-for="item in fontFamily"
        :key="item.label"
        class="font-family-item"
        variant="ghost"
        :style="{
          fontFamily: item.value,
        }"
        :class="{
          active: props.editor?.isActive('textStyle', {
            fontFamily: item.value,
          }),
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
