<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { list } from '@/lib/edit';
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import TiptopDown from '../common/TiptopDown.vue';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <TiptopDown
    title="列表"
    :editor="props.editor"
    label="列表"
    icon="lucide:list"
  >
    <template #dropdown>
      <Button
        v-for="item in list"
        :key="item.value"
        variant="ghost"
        class="w-full cursor-pointer"
        :class="{
          ' bg-neutral-100': props.editor?.isActive(item.value),
        }"
        @click="item.onClick(props.editor as Editor)"
      >
        <Icon :icon="item.iconName" />
        {{ item.label }}
      </Button>
    </template>
  </TiptopDown>
</template>

<style scoped></style>
