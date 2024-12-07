<script setup lang="ts">
import WorkspaceList from "@/components/workspace/WorkspaceList.vue";
import { useGetWorkspaces } from "@/hooks/workspace";
import useUser from "@/store/user";
import { RouterView } from "vue-router";
const { userData } = useUser();
const token = userData?.session.access_token as string;
const { workspaces, workspacesError, workspacesIsLoading } =
  useGetWorkspaces(token);
console.log(workspaces);
</script>
<template>
  <!-- <FromCard /> -->
  <aside class="aside-container bg-[#f0f0f0] dark:bg-[#121212]">
    <WorkspaceList
      :workspaces="workspaces"
      :isLoading="workspacesIsLoading"
      :error="workspacesError"
    />
  </aside>
  <section class="main-content-container">
    <RouterView />
  </section>
</template>

<style lang="scss" scoped>
.aside-container {
  flex-basis: 80px;
}
.main-content-container {
  flex: 1;
}
</style>
