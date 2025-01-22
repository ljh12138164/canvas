<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { toast } from '@/lib';
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import TiptopDown from '../common/TiptopDown.vue';
const link = ref('');
const inputRef = ref<HTMLInputElement>();
const props = defineProps<{
  editor: Editor | null;
}>();
const handleLink = () => {
  if (!props.editor || !link.value) return;
  toast.dismiss();
  toast.success('图片插入成功');
  props.editor?.chain().focus().setImage({ src: link.value }).run();
  link.value = '';
};
const handleImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  link.value = url;
  handleLink();
  (e.target as HTMLInputElement).value = '';
};
const handleImageClick = () => {
  inputRef.value?.click();
};
</script>
<template>
  <TiptopDown
    title="图片"
    :editor="props.editor"
    label="图片"
    icon="lucide:image"
    :height="200"
  >
    <template #dropdown>
      <section class="link-container">
        <Button
          variant="outline"
          @click="handleImageClick"
          size="sm"
          class="w-full"
          >上传图片</Button
        >
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" class="w-full" size="sm">输入链接</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>输入图片链接</DialogTitle>
            </DialogHeader>
            <Input v-model="link" placeholder="输入链接" />
            <DialogFooter>
              <DialogClose>
                <Button
                  variant="ghost"
                  class="w-full"
                  size="sm"
                  @click="handleLink"
                  >确定</Button
                ></DialogClose
              >
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImage"
      />
    </template>
  </TiptopDown>
</template>

<style scoped lang="scss">
.link-container {
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  gap: 8px;
}
</style>
