<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Button } from "../ui/button";

const { iconName } = defineProps<{
  iconName: string;
  isActive: boolean;
  onClick: () => void;
}>();
</script>
<template>
  <Button
    variant="ghost"
    @click="onClick"
    class="kitBtn"
    :class="{ active: isActive }"
  >
    <Icon :icon="iconName" />
  </Button>
</template>

<style scoped lang="scss">
.kitBtn {
  cursor: pointer;
  height: 24px;
  min-width: 24px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e5e5e5cc;
  }
}
</style>
