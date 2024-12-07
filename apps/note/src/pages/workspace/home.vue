<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import FromCard from "@/components/workspace/FromCard.vue";
</script>
<template>
  <section class="home-container border border-gray-200 dark:border-gray-800">
    <ScrollArea class="h-[85dvh]">
      <FromCard />
    </ScrollArea>
  </section>
</template>

<style scoped lang="scss">
.home-container {
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  margin: 0 10px;
}
</style>
