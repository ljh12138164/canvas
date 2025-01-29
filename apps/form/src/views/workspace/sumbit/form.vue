<script setup lang="ts">
import FormPreviwe from '@/components/form/FormPreviwe.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { uploadCustomType } from '@/database/image';
import { useGetInviteCodeData } from '@/hooks/board';
import { useSubmitBoard } from '@/hooks/submit';
import { toast } from '@/lib';
import { getFileType } from '@/lib/form';
import type { CreateFormItem } from '@/types/form';
import { to } from 'await-to-js';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const inviteCode = useRoute().params.inviteCode as string;
const { mutate, isPending } = useSubmitBoard();
const { data: boardData, isLoading, error } = useGetInviteCodeData(inviteCode);
// 提交自定义表单
const submit = async (data: Record<string, any>) => {
  if (!boardData.value) return;
  // 创建新的data
  const newData: Record<string, any> = data;
  const schema = JSON.parse(boardData.value.schema) as CreateFormItem[];
  // 给提交的data添加其他属性
  for (const item of schema) {
    // 对象类型
    if (item.type === 'obj') {
      const [label, value] = Object.entries(newData[item.name])[0];

      newData[item.name] = {};
      item.children.forEach((child) => {
        newData[item.name][child.name] = {
          SubmitValue: value,
          type: child.type,
          label: label,
          options: child.type === 'select' ? child.options : null,
          hiddenLabel: child.hiddenLabel,
        };
      });
      // 递归
    } else if (item.type === 'file') {
      // 上传文件
      const data = newData[item.name];
      // base64;
      const base64 = data.split('base64,')[1];

      const { fullType, fileType, type } = getFileType(data);
      toast.info('文件上传中...');
      // 上传文件
      const [err, uploadPath] = await to(
        uploadCustomType({ base64, formId: boardData.value.id, fullType }),
      );
      if (err) return toast.error('上传失败');
      toast.success('上传成功');
      newData[item.name] = {
        file: uploadPath || '',
        type: item.type,
        // input属性的
        inputType: type,
        fullType,
        fileType,
        label: item.description,
        hiddenLabel: item.hiddenLabel,
      };
    } else {
      newData[item.name] = {
        SubmitValue: newData[item.name],
        type: item.type,
        label: item.description,
        options: item.type === 'select' ? item.options : null,
        hiddenLabel: item.hiddenLabel,
      };
    }
  }
  mutate(
    { json: { id: boardData.value.id, submit: JSON.stringify(newData) } },
    {
      onError: () => {
        toast.error('提交失败');
      },
      onSuccess: (data) => {
        toast.success('提交成功');
        router.push(`/workspace/my-submit/${data.id}`);
      },
    },
  );
};
</script>
<template>
  <ScrollArea class="w-full h-[calc(100dvh-100px)]">
    <section v-if="isLoading">
      <div class="space-y-4">
        <!-- 标题骨架 -->
        <Skeleton class="h-8 w-3/4" />

        <!-- 表单项骨架 -->
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <Skeleton class="h-4 w-1/4" />
            <Skeleton class="h-10 w-full" />
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="error" class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1">
      <div class="text-center">{{ error.message }}</div>
      <Button @click="router.back()">返回</Button>
    </section>

    <section v-else-if="boardData?.schema">
      <FormPreviwe :schema="boardData?.schema" @submit="submit" :isPending="isPending"
        class-name="min-h-[calc(100vh-100px)]" />
    </section>
    <section v-else-if="error" class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1">
      <div class="text-center">无数据</div>
      <Button @click="router.back()">返回</Button>
    </section>
  </ScrollArea>
</template>
