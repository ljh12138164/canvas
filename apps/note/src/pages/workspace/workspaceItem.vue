<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import { useGetWorkspaceById } from '@/hooks/workspace';
import useUser from '@/store/user';
import { useQueryClient } from '@tanstack/vue-query';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const queryClient = useQueryClient();
const token = useUser()?.userData?.session.access_token as string;

const route = useRoute();
const { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching } =
  useGetWorkspaceById(token, route.params.workspaceId as string);
watch(
  () => route.params.workspaceId,
  () => {
    queryClient.invalidateQueries({ queryKey: ['workspaceItem'] });
  },
);
const router = useRouter();
const handleManageCollaborators = () => {
  router.push(`/workspace/${route.params.workspaceId}/member`);
};
</script>
<template>
  <div class="workspace-item-container">
    <div v-if="workspaceIsLoading || workspaceIsFetching">
      <Skeleton class="w-full h-[300px] bg-[#d8d8d8] dark:bg-[#3a3a3a]" />
    </div>
    <div v-else-if="workspace">
      <div>{{ workspace?.title }}</div>
      <div>{{ workspace.profiles }}</div>
      <Button @click="handleManageCollaborators">管理协作</Button>
    </div>
    <div v-else-if="workspaceError" class="text-red-500">
      <div>查询失败</div>
    </div>
    <div v-else>
      <div>没有找到该工作区</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workspace-item-container {
  padding: 20px;
}
</style>
