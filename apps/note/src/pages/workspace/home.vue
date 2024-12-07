<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import FromCard from '@/components/workspace/FromCard.vue';
import userData from '@/store/user';
import InviteDialog from './InviteDialog.vue';
const token = userData()?.userData?.session.access_token as string;
</script>
<template>
  <section class="home-container border border-gray-200 dark:border-gray-800">
    <ScrollArea class="h-[85dvh]">
      <div class="flex flex-col gap-4">
        <FromCard />
        <InviteDialog :token="token" />
      </div>
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
