<script setup lang="ts">
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
import { Input } from '@/components/ui/input';
import { useDeleteBoard, useUpdateBoard } from '@/hooks/board';
import { toast } from '@/lib';
import type { Form } from '@/types';
import { useQueryClient } from '@tanstack/vue-query';
import { MoreVertical, Pencil, Presentation, Trash2 } from 'lucide-vue-next';
import { FormInputIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const queryClient = useQueryClient();
const closeRef = ref<HTMLButtonElement>();
const closeRef2 = ref<HTMLButtonElement>();
const router = useRouter();
const props = defineProps<{
  payment: Form;
}>();
const { mutate: deleteBoard } = useDeleteBoard();
const { mutate: updateBoard } = useUpdateBoard();
const handleUpdateFomr = async () => {
  router.push(`/workspace/form/edit/${props.payment.id}`);
};
const handlePreview = async () => {
  router.push(`/workspace/form/detail/${props.payment.id}`);
};
const input = ref(props.payment.name);
const description = ref(props.payment.description);
const handleDelete = () => {
  deleteBoard(
    { json: { id: props.payment.id } },
    {
      onSuccess: () => {
        toast.success('删除成功');
        closeRef.value?.click();
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['board'] });
      },
    },
  );
};
const handleEdit = async () => {
  if (!input.value) {
    toast.error('请输入表单名称');
    return;
  }
  updateBoard(
    { json: { id: props.payment.id, name: input.value, description: description.value } },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['board'] });
        closeRef2.value?.click();
        toast.success('编辑成功');
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
          @click="handlePreview"
        >
          <Presentation />
          <span>详细</span>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Button
          variant="ghost"
          class="p-0 w-full cursor-pointer"
          @click="handleUpdateFomr"
        >
          <FormInputIcon />
          <span>表单编辑</span>
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
              <DialogTitle>编辑表单</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>确定要编辑表单吗？</p>
            </DialogDescription>
            <Input v-model="input" />
            <Input v-model="description" />
            <DialogFooter>
              <DialogClose>
                <Button ref="closeRef2"> 取消 </Button>
              </DialogClose>
              <Button variant="destructive" @click="handleEdit">
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
              <DialogTitle>删除表单</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>确定要删除表单吗？</p>
            </DialogDescription>
            <DialogFooter>
              <DialogClose>
                <Button ref="closeRef"> 取消 </Button>
              </DialogClose>
              <Button variant="destructive" @click="handleDelete">
                删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
