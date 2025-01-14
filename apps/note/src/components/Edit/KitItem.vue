<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const { iconName, isActive, onClick, label, editor, disabled } = defineProps<{
  iconName: string;
  editor: Editor | null;
  isActive: boolean | undefined;
  onClick?: (editor: Editor) => void;
  label: string;
  disabled?: boolean;
}>();
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          @click="onClick && onClick(editor as Editor)"
          class="kitBtn"
          :disabled="disabled"
          :class="{ 'is-active': isActive }"
        >
          <Icon :icon="iconName" class="kit-icon" />
        </Button>
      </TooltipTrigger>
      <TooltipContent :duration="100" class="tooltip-content">
        <span>{{ label }}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped lang="scss">
.kitBtn {
  cursor: pointer;
  height: 32px;
  min-width: 32px;
  padding: 0 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &.is-active {
    background-color: rgba(0, 0, 0, 0.08);
    color: #1a73e8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.kit-icon {
  width: 18px;
  height: 18px;
}

:deep(.tooltip-content) {
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
