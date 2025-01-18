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
import { useGetMySubmit } from '@/hooks/submit'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import Table from '@/components/sumbit/Table.vue'

const { data: mySubmit, isLoading } = useGetMySubmit()
</script>
