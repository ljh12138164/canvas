<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
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
  <TiptopDown
    title="链接"
    :editor="props.editor"
    :label="link"
    icon="lucide:link"
    :trigger="handleDefaultLink"
  >
    <template #dropdown>
      <section class="link-container">
        <Input v-model="link" placeholder="输入链接" />
        <Button variant="outline" size="sm" @click="handleLink">确定</Button>
      </section>
    </template>
  </TiptopDown>
</template>

<style scoped lang="scss">
.link-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
