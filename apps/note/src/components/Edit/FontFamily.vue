<script setup lang="ts">
import { fontFamily } from '@/lib/edit';
import TiptopDown from '../common/TiptopDown.vue';
import type { Editor } from '@tiptap/vue-3';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { onMounted, ref } from 'vue';
import { Button } from '../ui/button';

const props = defineProps<{
  editor: Editor | null;
}>();
const activeFontFamily = ref('Arial');
onMounted(() => {
  fontFamily.forEach((item) => {
    if (
      props.editor?.isActive('textStyle', {
        fontFamily: item.value,
      })
    ) {
      return item.label;
    }
  });
  return 'Arial';
});
</script>
<template>
  <TiptopDown
    label="字体"
    :editor="props.editor"
    :title="activeFontFamily"
    icon="heroicons:chevron-down"
  >
    <template #dropdown>
      <DropdownMenuItem v-for="item in fontFamily" as-child>
        <Button
          @click="
            () => {
              props.editor?.chain().focus().setFontFamily(item.value).run();
              activeFontFamily = item.label;
            }
          "
          :key="item.label"
          class="font-family-item cursor-pointer"
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
      </DropdownMenuItem>
    </template>
  </TiptopDown>
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
  width: 100%;
  cursor: pointer;
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
