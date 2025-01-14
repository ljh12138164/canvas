<script setup lang="ts">
import { useGetWorkspaceById } from '@/hooks/workspace';
import { useGetDoc } from '@/hooks/doc';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Edit from './Edit.vue';

const route = useRoute();
const workspaceId = ref(route.params.workspaceId);

watch(
  () => route.params.workspaceId,
  (newVal) => {
    workspaceId.value = newVal;
  }
);
const { workspace, workspaceIsLoading, workspaceIsFetching } =
  useGetWorkspaceById(workspaceId.value as string);
const { data, isLoading, isFetching } = useGetDoc();
</script>
<template>
  <div
    v-if="workspaceIsLoading || workspaceIsFetching || isFetching || isLoading"
  >
    加载中
  </div>
  <div v-else class="h-full">
    <Edit :workspace="workspace" :doc="data" />
  </div>
</template>

<style scoped></style>
