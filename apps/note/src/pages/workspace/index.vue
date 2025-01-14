<script setup lang="ts">
import WorkspaceList from '@/components/workspace/WorkspaceList.vue';
import { useGetWorkspaces } from '@/hooks/workspace';
import { RouterView } from 'vue-router';
const {
  workspaces,
  workspacesError,
  workspacesIsLoading,
  workspacesIsFetching,
} = useGetWorkspaces();
</script>
<template>
  <!-- <FromCard /> -->
  <div class="flex h-[100dvh] w-full">
    <aside class="aside-container min-w-[80px] bg-[#f0f0f0] dark:bg-[#121212]">
      <WorkspaceList
        :isFetching="workspacesIsFetching"
        :workspaces="workspaces"
        :isLoading="workspacesIsLoading"
        :error="workspacesError"
      />
    </aside>
    <section class="main-content-container">
      <RouterView />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.aside-container {
  flex-basis: 80px;
}
.main-content-container {
  flex: 1;
}
</style>
