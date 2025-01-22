<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDeleteFolder } from '@/hooks/floders';
import type { getWorkspaceByIdResponse } from '@/hooks/workspace';
import { useQueryClient } from '@tanstack/vue-query';
import { MoreVertical, Pencil, Presentation, Trash2 } from 'lucide-vue-next';
import { FormInputIcon } from 'lucide-vue-next';
import { ref } from 'vue';
const queryClient = useQueryClient();
const { deleteFolder, deleteFolderIsLoading } = useDeleteFolder();

const closeRef = ref<HTMLButtonElement>();
const closeRef2 = ref<HTMLButtonElement>();
const props = defineProps<{
  payment: getWorkspaceByIdResponse['folders'][];
}>();
const handleUpdateFomr = () => {};
const handlePreview = () => {};
const handleDelete = () => {
  deleteFolder(
    { query: { id: props.payment.id, workspaceId: props.payment.workspaceId } },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['folders'] });
      },
    },
  );
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="p-0 w-full">
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Button
          variant="ghost"
          class="p-0 w-full cursor-pointer"
          @click.stop="handlePreview"
        >
          <Presentation />
          <span>文件夹</span>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Button variant="ghost" class="p-0 w-full cursor-pointer">
          <FormInputIcon />
          <span>文件夹编辑</span>
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
            <Input />
            <Input />
            <DialogFooter>
              <DialogClose>
                <Button ref="closeRef2"> 取消 </Button>
              </DialogClose>
              <Button variant="destructive">
                <p class="flex items-center gap-2"><Pencil />编辑</p>
              </Button>
            </DialogFooter>
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
