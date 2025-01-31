    
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMySubmit } from '@/hooks/submit';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const { data: mySubmit, isLoading } = useGetMySubmit();
const search = ref('');
const sumbit = computed(() => {
  return mySubmit.value?.filter((item) => item.form.name.includes(search.value));
});
</script>
<template>

  <ScrollArea>
    <section v-if="isLoading" class="flex flex-col gap-2">
      <Skeleton class="h-16 w-full" />
      <Skeleton class="h-16 w-full" />
      <Skeleton class="h-16 w-full" />
      <Skeleton class="h-16 w-full" />
      <Skeleton class="h-16 w-full" />
      <Skeleton class="h-16 w-full" />
    </section>
    <section v-else-if="sumbit">
      <nav class="text-lg font-bold mb-4 flex items-center justify-between">
        <p class="mr-2">提交记录：</p> <Input v-model="search" placeholder="搜索" class="w-1/2" />
      </nav>
      <Card v-for="submit in sumbit" :key="submit.id" class="cursor-pointer my-2"
        @click="router.push(`/workspace/my-submit/${submit.id}`)">
        <CardContent>
          <div class="pt-4 transition-colors">
            <div class="flex items-center justify-between">
              <h3 class="font-medium">{{ submit.form.name }}</h3>
              <span class="text-sm ">
                {{ dayjs(submit.created_at).format('YYYY年MM月DD日 HH:mm:ss') }}
              </span>
            </div>
            <div class="mt-2 text-sm">
              <p>表单邀请码：{{ submit.form.inviteCode }}</p>
              <p class="mt-1">表单标题：{{ submit.form.name }}</p>
              <p class="mt-1">表单描述：{{ submit.form.description || '-' }}</p>
            </div>
          </div>
        </CardContent>
      </Card>


      <div v-if="mySubmit?.length === 0" class="text-center text-gray-500 py-8">
        暂无提交记录
      </div>
    </section>
  </ScrollArea>
</template>
