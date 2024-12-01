<script lang="ts" setup>
// @ts-ignore
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
const emojis = defineModel<string>();
function onSelectEmoji(emoji: any) {
  emojis.value = emoji.i;
}
</script>

<template>
  <EmojiPicker :native="true" theme="dark" @select="onSelectEmoji" />
</template>

<style scoped lang="scss">
.emoji {
  font-size: 2em;
}
</style>
