<!-- <script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
const emojis = defineModel<string>();
const emit = defineEmits<(e: 'change', emojis: string) => void>();
function onSelectEmoji(emoji: any) {
  emojis.value = emoji.i;
  emit('change', emoji.i);
}
</script>

<template>
  <EmojiPicker :native="true" theme="dark" @select="onSelectEmoji" />
</template>

<style scoped lang="scss">
.emoji {
  font-size: 2em;
}
</style> -->
