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
          :style="{ backgroundColor: isActive ? '#e5e5e5cc' : 'transparent' }"
        >
          <Icon :icon="iconName" class="kit-icon" />
        </Button>
      </TooltipTrigger>
      <TooltipContent :duration="100">
        <span>{{ label }}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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
.kit-icon {
  width: 16px;
  height: 16px;
}
</style>
