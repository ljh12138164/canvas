<template>
  <div>
    <Drawer>
      <DrawerTrigger as-child> </DrawerTrigger>
      <DrawerContent>
      <div>111</div>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { Drawer } from '../ui/drawer'

const props = defineProps<{
  list: { id: string; name: string }[]
}>()
</script>
