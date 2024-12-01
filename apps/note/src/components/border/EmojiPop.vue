<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Button from "../ui/button/Button.vue";
import EmojiPick from "../common/EmojiPick.vue";
import { ref } from "vue";

const emojis = ref("");
</script>

<template>
  <Popover>
    <PopoverTrigger><Button variant="outline">选择表情</Button></PopoverTrigger>
    <PopoverContent as-child>
      <EmojiPick v-model="emojis" />
    </PopoverContent>
  </Popover>
</template>
<style scoped lang="scss">
.emoji {
  font-size: 1.5em;
}
</style>
