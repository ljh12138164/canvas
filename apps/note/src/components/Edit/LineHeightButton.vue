<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineHeightExtension } from "@/lib/edit";
import { Icon } from "@iconify/vue";
import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
const props = defineProps<{
  editor: Editor | null;
}>();
const lineHeight = ref(props.editor?.getAttributes("paragraph").lineHeight);
</script>
<template>
  <DropdownMenu v-if="props.editor">
    <DropdownMenuTrigger>
      <Button variant="outline">
        <Icon :icon="'mdi:format-letter-spacing'" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child>
        <Button
          v-for="item in LineHeightExtension"
          :key="item.value"
          variant="ghost"
          class="w-full cursor-pointer"
          :class="{
            ' bg-neutral-100': lineHeight === item.value,
          }"
          @click="
            {
              props.editor?.commands.focus();
              console.log(item.value);
              props.editor?.chain().focus().setLineHeight(item.value).run();
              lineHeight = item.value;
            }
          "
        >
          {{ item.label }}
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
