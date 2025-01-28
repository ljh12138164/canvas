<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeleteFile, useGetFileTrash, useRestoreFile } from '@/hooks/file';
import { useDeleteFolderTrash, useGetFolderTrash, useRestoreFolderTrash } from '@/hooks/floders';
import { toast } from '@/lib/index';
import { useQueryClient } from '@tanstack/vue-query';
import dayjs from 'dayjs';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ResponsePop from '../workspace/Respone.vue';

const queryClient = useQueryClient();
const router = useRoute();
const workspaceId = ref(router.params.workspaceId as string);
watch(
  () => router.params.workspaceId,
  () => {
    workspaceId.value = router.params.workspaceId as string;
  },
);
const type = ref<'folder' | 'file'>('folder');
const { folderTrash, folderTrashIsLoading } = useGetFolderTrash(workspaceId.value, type.value);

// 文件夹操作
const { deleteFolderTrash, deleteFolderTrashIsLoading } = useDeleteFolderTrash();
const { restoreFolderTrash, restoreFolderTrashIsLoading } = useRestoreFolderTrash();
// 文件操作
const { restoreFile, restoreFileIsPending } = useRestoreFile();
const { deleteFile, deleteFileIsPending } = useDeleteFile();

const { fileTrash, fileTrashIsLoading } = useGetFileTrash(workspaceId.value, type.value);
</script>
<template>
    <ScrollArea>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <div class="flex items-center">
                    <Button @click="type = 'folder'" variant="ghost"
                        :class="type === 'folder' ? 'active' : ''">文件夹</Button>
                    <Button @click="type = 'file'" variant="ghost" :class="type === 'file' ? 'active' : ''">文件</Button>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <Table :data="folderTrash" v-if="type === 'folder'" :loading="folderTrashIsLoading">
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="item in folderTrash" :key="item.id">
                            <TableCell>{{ item.title }}</TableCell>
                            <TableCell>{{ dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}</TableCell>
                            <TableCell class="flex items-center gap-2">
                                <ResponsePop title="恢复" ref="closeFn">
                                    <template #trigger>
                                        <Button variant="outline" :disabled="restoreFolderTrashIsLoading">恢复</Button>
                                    </template>
                                    <template #close>
                                        <Button variant="outline">取消</Button>
                                    </template>
                                    <template #entry>
                                        <Button :disabled="restoreFolderTrashIsLoading" @click="() => {
                                            restoreFolderTrash({ json: { id: item.id!, workspaceId } }, {
                                                onSuccess: () => {
                                                    queryClient.invalidateQueries({ queryKey: ['folderTrash'] })
                                                    toast.success('恢复成功')
                                                }
                                            })
                                        }">恢复</Button>
                                    </template>
                                </ResponsePop>
                                <ResponsePop title="删除" ref="closeFn">
                                    <template #trigger>
                                        <Button variant="destructive" :disabled="deleteFolderTrashIsLoading">删除</Button>
                                    </template>
                                    <template #close>
                                        <Button variant="outline">取消</Button>
                                    </template>
                                    <template #entry>
                                        <Button variant="destructive" :disabled="deleteFolderTrashIsLoading" @click="() => {
                                            deleteFolderTrash({ json: { id: item.id!, workspaceId } }, {
                                                onSuccess: () => {
                                                    queryClient.invalidateQueries({ queryKey: ['folderTrash'] })
                                                    toast.success('删除成功')
                                                }
                                            })

                                        }">删除</Button>
                                    </template>
                                </ResponsePop>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <div class="flex items-center justify-center h-full w-full" v-if="folderTrash?.length === 0">
                        <p class="text-sm text-gray-500">暂无数据</p>
                    </div>
                </Table>
                <Table :data="fileTrash" v-if="type === 'file'" :loading="fileTrashIsLoading">
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="item in fileTrash" :key="item.id">
                            <TableCell>{{ item.title }}</TableCell>
                            <TableCell>{{ dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}</TableCell>
                            <TableCell class="flex items-center gap-2">
                                <ResponsePop title="恢复" ref="closeFn">
                                    <template #trigger>
                                        <Button variant="outline" :disabled="restoreFileIsPending">恢复</Button>
                                    </template>
                                    <template #close>
                                        <Button variant="outline">取消</Button>
                                    </template>
                                    <template #entry>
                                        <Button :disabled="restoreFileIsPending" @click="() => {
                                            restoreFile({ query: { id: item.id!, workspaceId } }, {
                                                onSuccess: () => {
                                                    queryClient.invalidateQueries({ queryKey: ['fileTrash'] })
                                                    toast.success('恢复成功')
                                                }
                                            })
                                        }">恢复</Button>
                                    </template>
                                </ResponsePop>
                                <ResponsePop title="删除" ref="closeFn">
                                    <template #trigger>
                                        <Button variant="destructive" :disabled="deleteFileIsPending">删除</Button>
                                    </template>
                                    <template #close>
                                        <Button variant="outline">取消</Button>
                                    </template>
                                    <template #entry>
                                        <Button variant="destructive" :disabled="deleteFileIsPending" @click="() => {
                                            deleteFile({ query: { id: item.id!, workspaceId } }, {
                                                onSuccess: () => {
                                                    queryClient.invalidateQueries({ queryKey: ['fileTrash'] })
                                                    toast.success('删除成功')
                                                }
                                            })
                                        }">删除</Button>
                                    </template>
                                </ResponsePop>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <div class="flex items-center justify-center h-full w-full" v-if="fileTrash?.length === 0">
                        <p class="text-sm text-gray-500">暂无数据</p>
                    </div>
                </Table>
            </div>
        </div>
    </ScrollArea>
</template>

<style scoped lang="scss">
.active {
    background-color: #f0f0f0;
}

.dark {
    & .active {
        background-color: #1a1a1a;
    }
}
</style>
