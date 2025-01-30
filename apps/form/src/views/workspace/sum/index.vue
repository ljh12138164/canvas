<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetrBoard } from '@/hooks/board';
import { useRouter } from 'vue-router';
const router = useRouter();
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
const { data, isLoading } = useGetrBoard();
</script>
<template>
  <ScrollArea class="max-h-[calc(100dvh-150px)]">
    <h2 class="mb-2 text-xl font-bold">选择表单</h2>
    <section v-if='isLoading' class="flex flex-col gap-2">
      <Skeleton class="w-full" />
      <Skeleton class="w-full" />
      <Skeleton class="w-full" />
      <Skeleton class="w-full" />
    </section>
    <section v-else-if="data" class="flex flex-col gap-2">
      <Card v-for="item in data" @click="router.push(`/workspace/sum/${item.id}`)" class=" cursor-pointer">
        <CardHeader>
          <CardTitle>名字：{{ item.name }}</CardTitle>
          <CardDescription>描述：{{ item.description ?? "--" }}</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </section>
    <section v-else>
      暂无数据
    </section>
  </ScrollArea>
</template>
