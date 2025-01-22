<script setup lang="ts">
import UserButton from '@/components/common/UserButton.vue';
import WorkspaceList from '@/components/workspace/WorkspaceList.vue';
import { useGetWorkspaces } from '@/hooks/workspace';
import { RouterView } from 'vue-router';
const { workspaces, workspacesError, workspacesIsLoading, workspacesIsFetching } =
  useGetWorkspaces();
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
      <nav class="nav-header">
        <div class="nav-left">
          <h1 class="nav-title">工作区</h1>
        </div>
        <div class="nav-right">
          <UserButton />
        </div>
      </nav>
      <div class="flex-1">
        <RouterView />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.aside-container {
  flex-basis: 80px;
}
.main-content-container {
  flex: 1;

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    border-bottom: 1px solid #e5e7eb;

    :deep(.dark) & {
      border-color: #1f2937;
    }
  }

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-title {
    font-size: 1.125rem;
    font-weight: 500;
  }
}
</style>
