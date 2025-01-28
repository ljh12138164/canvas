<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDoc } from '@/hooks/doc';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Edit from './edit/Edit.vue';

const route = useRoute();
const workspaceId = ref(route.params.workspaceId);

watch(
  () => route.params.workspaceId,
  (newVal) => {
    workspaceId.value = newVal;
  },
);
const { workspace, workspaceIsLoading, workspaceIsFetching } = useGetWorkspaceById(
  workspaceId.value as string,
);
const { data, isLoading, isFetching } = useGetDoc();
</script>
<template>
  <div v-if="workspaceIsLoading || workspaceIsFetching || isFetching || isLoading" class="h-full p-6 space-y-6">
    <!-- 头部骨架 -->
    <div class="flex items-center justify-between">
      <Skeleton class="h-8 w-[200px]" />
      <div class="flex gap-4">
        <Skeleton class="h-8 w-8 rounded-full" />
        <Skeleton class="h-8 w-8 rounded-full" />
      </div>
    </div>

    <!-- 内容区域骨架 -->
    <div class="space-y-4">
      <Skeleton class="h-8 w-[300px]" />
      <Skeleton class="h-4 w-[80%]" />
      <Skeleton class="h-4 w-[60%]" />
      <Skeleton class="h-4 w-[70%]" />
    </div>

    <!-- 编辑器工具栏骨架 -->
    <div class="flex gap-2">
      <Skeleton class="h-8 w-8" />
      <Skeleton class="h-8 w-8" />
      <Skeleton class="h-8 w-8" />
      <Skeleton class="h-8 w-8" />
      <Skeleton class="h-8 w-8" />
    </div>

    <!-- 主要内容区域骨架 -->
    <div class="space-y-4 mt-8">
      <Skeleton v-for="index in 8" :key="index" class="h-4 w-full" />
    </div>
  </div>
  <div v-else class="h-full">
    <Edit :workspace="workspace" :doc="data" />
  </div>
</template>
