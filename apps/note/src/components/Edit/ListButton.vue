<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { list } from '@/lib/edit';
import { Icon } from '@iconify/vue';
import type { Editor } from '@tiptap/vue-3';

const props = defineProps<{
  editor: Editor | null;
}>();
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button variant="outline">
        <Icon :icon="list[0].iconName" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-for="item in list" :key="item.value" as-child>
        <Button
          variant="ghost"
          class="w-full cursor-pointer"
          :class="{
            ' bg-neutral-100': props.editor?.isActive(item.value),
          }"
          @click="item.onClick(props.editor)"
        >
          <Icon :icon="item.iconName" />
          {{ item.label }}
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
