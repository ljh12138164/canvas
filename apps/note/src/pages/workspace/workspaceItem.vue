<script setup lang="ts">
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useGetWorkspaceById } from "@/hooks/workspace";
import useUser from "@/store/user";
import { useQueryClient } from "@tanstack/vue-query";
import { watch } from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoute, useRouter } from "vue-router";
const queryClient = useQueryClient();
const token = useUser()?.userData?.session.access_token as string;

const route = useRoute();
const { workspace, workspaceError, workspaceIsLoading, workspaceIsFetching } =
  useGetWorkspaceById(token, route.params.workspaceId as string);
watch(
  () => route.params.workspaceId,
  () => {
    queryClient.invalidateQueries({ queryKey: ["workspaceItem"] });
  }
);
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
      <Table v-if="workspace.folders.length > 0">
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]"> 文件夹名字 </TableHead>
            <TableHead>状态</TableHead>
            <TableHead>方法</TableHead>
            <TableHead class="text-right"> 文档数量 </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <div v-if="workspace.folders.length > 0">
            <TableRow
              v-for="folder in workspace.folders"
              :key="folder.id"
              @click="handleGoFolder(folder.id as string)"
            >
              <TableCell class="font-medium">
                {{ folder.title }}
              </TableCell>
              <TableCell>{{ folder.inTrash ? "已删除" : "正常" }}</TableCell>
              <TableCell>{{ folder.title }}</TableCell>
              <TableCell class="text-right">
                {{ folder.files.length }}
              </TableCell>
            </TableRow>
          </div>
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
</style>
