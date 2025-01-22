<script setup lang="ts">
import FileFrom from '@/components/border/FileFrom.vue';
import ResponsePop from '@/components/common/ResponsePop.vue';
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import WorkspaceTable from '@/components/workspace/WorkspaceTable.vue';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { useQueryClient } from '@tanstack/vue-query';
import { Plus } from 'lucide-vue-next';
import { onBeforeMount } from 'vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const queryClient = useQueryClient();

const route = useRoute();
const workspaceId = ref(route.params.workspaceId as string);
const { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching } = useGetWorkspaceById(
  workspaceId.value,
);
watch(
  () => route.params.workspaceId,
  () => {
    workspaceId.value = route.params.workspaceId as string;
    queryClient.invalidateQueries({ queryKey: ['workspaceItem'] });
    queryClient.invalidateQueries({ queryKey: ['collaborators'] });
  },
);

onBeforeMount(() => {
  queryClient.invalidateQueries({ queryKey: ['workspaceItem'] });
  queryClient.invalidateQueries({ queryKey: ['collaborators'] });
});
const router = useRouter();
const handleManageCollaborators = () => {
  router.push(`/workspace/${route.params.workspaceId}/member`);
};
</script>
<template>
  <div class="workspace-item-container">
    <nav class="nav-container">
      <Button @click="router.back()">返回</Button>
      <ResponsePop title="新建文件夹" ref="responsePopRef">
      <template #trigger>
        <Button class="flex items-center">
          <Plus class="ml-auto" />
          新建文件夹
        </Button>
      </template>
      <template #content>
        <FileFrom />
      </template>
    </ResponsePop>
    </nav>
    <div v-if="workspaceIsLoading || workspaceIsFetching">
      <div class="space-y-4">
        <!-- 标题骨架 -->
        <Skeleton class="w-1/3 h-8" />
        <!-- 表格骨架 -->
        <div class="space-y-2">
          <Skeleton class="w-full h-12" />
          <Skeleton class="w-full h-12" />
          <Skeleton class="w-full h-12" />
        </div>
        <!-- 按钮骨架 -->
        <Skeleton class="w-24 h-10" />
      </div>
    </div>
    <div v-else-if="workspace">
      <WorkspaceTable
        :data="Array.isArray(workspace.folders) ? workspace.folders : []"
        v-if="workspace.folders"
      />
      <div v-else>没有文件夹</div>
      <div>
        <Button @click="handleManageCollaborators">管理协作</Button>
      </div>
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
.table-cell-ellipsis {
  max-width: 100px;
  overflow: hidden;
  /* text-align: center; */
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icons {
  font-size: 2rem;
}
.icons-container {
  display: flex;
  /* align-items: center; */
  justify-content: start;
}
.nav-container {
  display: flex;
  justify-content: space-between;

}
</style>
