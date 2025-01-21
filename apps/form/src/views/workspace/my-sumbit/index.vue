<template>
  <ScrollArea>
    <div v-if="isLoading">
      <Skeleton class="h-10 w-full" />
    </div>
    <div v-else-if="mySubmit">
      <Table :data="mySubmit" />
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import Table from '@/components/sumbit/Table.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMySubmit } from '@/hooks/submit';

const { data: mySubmit, isLoading } = useGetMySubmit();
</script>
