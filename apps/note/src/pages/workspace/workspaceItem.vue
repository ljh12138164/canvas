<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetWorkspaceById } from '@/hooks/workspace';
import useUser from '@/store/user';
import { useQueryClient } from '@tanstack/vue-query';
import { onBeforeMount } from 'vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const queryClient = useQueryClient();
const token = useUser()?.userData?.session.access_token as string;

const route = useRoute();
const workspaceId = ref(route.params.workspaceId as string);
const { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching } =
  useGetWorkspaceById(token, workspaceId.value);
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
const handleGoFolder = (folderId: string) => {
  router.push(`/workspace/${route.params.workspaceId}/folders/${folderId}`);
};
</script>
<template>
  <div class="workspace-item-container">
    <div v-if="workspaceIsLoading || workspaceIsFetching">
      <Skeleton class="w-full h-[300px] bg-[#d8d8d8] dark:bg-[#3a3a3a]" />
    </div>
    <div v-else-if="workspace">
      <Table v-if="workspace.folders">
        <TableHeader>
          <TableRow class="text-center">
            <TableHead class="table-cell-ellipsis" align="center">
              <span>文档图标</span>
            </TableHead>
            <TableHead class="table-cell-ellipsis" align="center">
              <span>文件夹名字</span>
            </TableHead>
            <TableHead class="table-cell-ellipsis" align="center">
              <span>状态</span>
            </TableHead>
            <TableHead class="table-cell-ellipsis" align="center">
              <span>文件数量</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="folder in workspace.folders"
            :key="folder.id"
            class="cursor-pointer"
            @click="handleGoFolder(folder.id as string)"
          >
            <TableCell class="table-cell-ellipsis icons-container">
              <span class="icons"> {{ folder.inconId }} </span>
            </TableCell>
            <TableCell class="table-cell-ellipsis">
              <span>{{ folder.title }}</span>
            </TableCell>
            <TableCell class="table-cell-ellipsis">
              <Badge :variant="folder.inTrash ? 'destructive' : 'default'">
                <span>{{ folder.inTrash ? '已删除' : '正常' }}</span>
              </Badge>
            </TableCell>
            <TableCell class="table-cell-ellipsis">
              <span>{{ folder.files.length }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
</style>
