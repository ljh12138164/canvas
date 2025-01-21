<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';

defineProps<{
  editor: Editor | null;
  title: string;
  label: string;
  icon: string;
  height?: number;
  trigger?: () => void;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="tiptop-btn"
        :class="{ 'is-active': editor?.isActive(title) }"
        @click="trigger && trigger()"
      >
        <Icon :icon="icon" class="tiptop-icon" />
        <span class="tiptop-label">{{ label }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      :style="height ? { maxHeight: height + 'px', overflow: 'auto' } : {}"
      class="tiptop-content"
    >
      <slot name="dropdown" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped lang="scss">
.tiptop-btn {
  height: 32px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &.is-active {
    background-color: rgba(0, 0, 0, 0.08);
    color: #1a73e8;
  }
}

.tiptop-icon {
  width: 18px;
  height: 18px;
}

.tiptop-label {
  font-size: 13px;
  font-weight: 500;
}

:deep(.tiptop-content) {
  min-width: 180px;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: white;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
}
</style>
