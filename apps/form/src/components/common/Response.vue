<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';

defineProps<{
  title: string;
  description?: string;
}>();
// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

const isOpen = ref(false);
</script>

<template>
  <UseTemplate>
    <slot name="content" />
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{
          description
        }}</DialogDescription>
      </DialogHeader>
      <GridForm />
      <DialogFooter>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>{{ title }}</DrawerTitle>
        <DrawerDescription v-if="description">{{
          description
        }}</DrawerDescription>
      </DrawerHeader>
      <GridForm />
      <DrawerFooter class="pt-2">
        <slot name="footer" />
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
