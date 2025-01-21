<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

import { useColorMode } from '@vueuse/core';
import { ref } from 'vue';
const emojis = ref<string>('');
const emit = defineEmits<(e: 'onChangeEmoji', emojis: string) => void>();
function onSelectEmoji(emoji: any) {
  emojis.value = emoji.i;
  emit('onChangeEmoji', emoji.i);
}
const mode = useColorMode();
</script>
<template>
  <Popover>
    <PopoverTrigger><slot name="trigger"></slot></PopoverTrigger>
    <PopoverContent as-child side="right">
      <EmojiPicker
        :native="true"
        v-model="emojis"
        :theme="mode === 'dark' ? 'dark' : 'light'"
        @select="onSelectEmoji"
      />
    </PopoverContent>
  </Popover>
</template>

<style scoped lang="scss"></style>
