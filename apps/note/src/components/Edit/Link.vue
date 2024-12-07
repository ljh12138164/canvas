<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
const link = ref('');
const props = defineProps<{
  editor: Editor | null;
}>();
const handleLink = () => {
  props.editor
    ?.chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: link.value })
    .run();
  link.value = '';
};
const handleDefaultLink = () => {
  const { href } = props.editor?.getAttributes('link') || {};
  link.value = href || '';
};
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button
        @click="handleDefaultLink"
        class="font-family-btn"
        variant="outline"
      >
        <Icon icon="lucide:link" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <section class="link-container">
        <Input v-model="link" placeholder="输入链接" />
        <Button variant="outline" size="sm" @click="handleLink">确定</Button>
      </section>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped lang="scss">
.link-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
