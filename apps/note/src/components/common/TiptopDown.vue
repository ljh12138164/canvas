<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const props = defineProps<{
  editor: Editor | null;
  icon: string;
  title: string | number;
  height?: number;
  label: string | number;
  trigger?: () => void;
}>();
</script>
<template>
  <TooltipProvider>
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger>
          <TooltipTrigger>
            <Button variant="outline" @click="props.trigger">
              <Icon :icon="props.icon" />
              {{ props.title }}
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>
          <p>{{ props.label }}</p>
        </TooltipContent>
        <DropdownMenuContent
          class="overflow-y-auto"
          :style="{ maxHeight: props.height + 'px' }"
        >
          <slot name="dropdown" />
        </DropdownMenuContent>
      </Tooltip>
    </DropdownMenu>
  </TooltipProvider>
</template>

<style lang="scss" scoped></style>
