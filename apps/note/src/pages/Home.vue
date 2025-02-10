<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDoc } from '@/hooks/doc';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Edit from './Edits.vue';

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
  <div
    v-if="workspaceIsLoading || workspaceIsFetching || isFetching || isLoading"
    class="h-full p-6 space-y-6"
  >
    <Skeleton class="h-full w-full" />
  </div>
  <div v-else class="h-full">
    <Edit :workspace="workspace" :doc="data" />
  </div>
</template>
