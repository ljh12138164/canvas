<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { align } from '@/lib/edit';
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
        <Icon :icon="align[0].iconName" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem v-for="item in align" :key="item.value" as-child>
        <Button
          variant="ghost"
          class="w-full cursor-pointer"
          :class="{
            ' bg-neutral-100': props.editor?.isActive({
              textAlign: item.value,
            }),
          }"
          @click="props.editor?.chain().focus().setTextAlign(item.value).run()"
        >
          <Icon :icon="item.iconName" />
          {{ item.label }}
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
