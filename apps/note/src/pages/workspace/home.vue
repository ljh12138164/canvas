<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import FromCard from '@/components/workspace/FromCard.vue';
import InviteDialog from './InviteDialog.vue';
// import { useGetWorkspaces } from "@/hooks/workspace";
// import WorkspaceList from "@/components/workspace/WorkspaceList.vue";
// const {
//   workspaces,
//   workspacesError,
//   workspacesIsLoading,
//   workspacesIsFetching,
// } = useGetWorkspaces();
</script>
<template>
  <div class="flex">
    <!-- <aside class="aside-container min-w-[80px] bg-[#f0f0f0] dark:bg-[#121212]">
      <WorkspaceList
        :isFetching="workspacesIsFetching"
        :workspaces="workspaces"
        :isLoading="workspacesIsLoading"
        :error="workspacesError"
      />
    </aside> -->
    <section
      class="home-container border border-gray-200 dark:border-gray-800 main-content-container"
    >
      <ScrollArea class="h-[85dvh]">
        <div class="flex flex-col gap-4">
          <FromCard />
          <InviteDialog />
        </div>
      </ScrollArea>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  margin: 0 10px;
}
.main-content-container {
  flex: 1;
}
</style>
