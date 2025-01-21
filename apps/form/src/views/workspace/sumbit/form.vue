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

    <section
      v-else-if="error"
      class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1"
    >
      <div class="text-center">加载失败，请稍后重试</div>
      <Button @click="router.back()">返回</Button>
    </section>

    <section v-else-if="boardData?.schema">
      <FormPreviwe
        :schema="boardData?.schema"
        @submit="submit"
        :isPending="isPending"
        class-name="min-h-[calc(100vh-100px)]"
      />
    </section>
    <section
      v-else-if="error"
      class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1"
    >
      <div class="text-center">无数据</div>
      <Button @click="router.back()">返回</Button>
    </section>
  </ScrollArea>
</template>

<script setup lang="ts">
import FormPreviwe from '@/components/form/FormPreviwe.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetInviteCodeData } from '@/hooks/board';
import { useSubmitBoard } from '@/hooks/submit';
import { toast } from '@/lib';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const inviteCode = useRoute().params.inviteCode as string;
const { mutate, isPending } = useSubmitBoard();
const { data: boardData, isLoading, error } = useGetInviteCodeData(inviteCode);
const submit = (data: Record<string, any>) => {
  if (!boardData.value) return;
  mutate(
    { json: { id: boardData.value.id, submit: JSON.stringify(data) } },
    {
      onError: () => {
        toast.error('提交失败');
      },
      onSuccess: () => {
        toast.success('提交成功');
        router.push('/workspace/board');
      },
    },
  );
};
</script>
