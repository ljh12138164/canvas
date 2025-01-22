<script setup lang="ts">
import FileFrom from '@/components/border/FileFrom.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteFolder } from '@/hooks/floders';
import type { getWorkspaceByIdResponse } from '@/hooks/workspace';
import { useQueryClient } from '@tanstack/vue-query';
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const { deleteFolder, deleteFolderIsLoading } = useDeleteFolder();

const closeRef = ref<HTMLButtonElement>();
const props = defineProps<{
  payment: getWorkspaceByIdResponse['folders'][number];
}>();
const handleDelete = () => {
  deleteFolder(
    {
      query: { id: props.payment.id!, workspaceId: props.payment.workspaceId },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      },
    },
  );
};
const handleDetail = () => {
  router.push(`/workspace/${route.params.workspaceId}/detail/${props.payment.id}`);
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="p-0 w-full" @click.stop="">
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child>
        <Button variant="ghost" class="p-0 w-full cursor-pointer" @click="handleDetail">
          <Eye />
          <span>查看详细</span>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" class="p-0 w-full cursor-pointer">
              <Pencil />
              <span>编辑</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑文件夹</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>确定要编辑文件夹吗？</p>
            </DialogDescription>
            <FileFrom
              edit
              :title="props.payment.title"
              :inconId="props.payment.inconId"
              :id="props.payment.id"
            />
          </DialogContent>
        </Dialog>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" class="p-0 w-full cursor-pointer">
              <Trash2 />
              <span>删除</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除文件夹</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>
                确定要删除<span class="text-red-500">{{
                  props.payment.title
                }}</span
                >吗？（删除后文件夹下的文件也会被删除）
              </p>
            </DialogDescription>
            <DialogFooter>
              <DialogClose>
                <Button ref="closeRef"> 取消 </Button>
              </DialogClose>
              <Button
                variant="destructive"
                @click.stop="handleDelete"
                :disabled="deleteFolderIsLoading"
              >
                删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
