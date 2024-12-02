<script setup lang="ts">
import FromCard from "@/components/workspace/FromCard.vue";
import useUser from "@/store/user";
import { useGetWorkspaces } from "@/hooks/workspace";
import { useRouter } from "vue-router";
const { userData } = useUser();
const router = useRouter();
const token = userData?.session.access_token as string;
const { workspaces, workspacesError, workspacesIsLoading } =
  useGetWorkspaces(token);
</script>
<template>
  <FromCard />
  <div v-if="workspacesIsLoading">加载中...</div>
  <div v-else-if="workspacesError">
    <div>{{ workspacesError.message }}</div>
  </div>
  <div v-else>
    <div v-for="workspace in workspaces" :key="workspace.id">
      <span @click="() => router.push(`/edit/${workspace.id}`)">
        {{ workspace.title }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
