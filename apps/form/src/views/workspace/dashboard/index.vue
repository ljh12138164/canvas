<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { type GetDashboardDataResponse, useGetDashboardData } from '@/hooks/dashboard';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const { data: dashboardData, isLoading } = useGetDashboardData();

const stats = computed(() => {
  return [
    {
      title: '总表单',
      value: dashboardData.value?.length || '0',
      icon: 'radix-icons:form',
      description: '创建的表单总数',
    },
    {
      title: '本月提交',
      value: dashboardData.value?.reduce((acc, curr) => acc + curr.submit.length, 0) || '0',
      icon: 'radix-icons:calendar',
      description: '本月收到的表单提交',
    },
  ];
});
const sumSubmit = computed(() => {
  return (
    dashboardData.value?.reduce(
      (acc: GetDashboardDataResponse[number]['submit'], cur) => acc.concat(cur.submit),
      [],
    ) || []
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});
const handleCreateForm = () => {
  router.push('/workspace/create');
};
const jumpToForm = (item: GetDashboardDataResponse[number]['submit'][number]) => {
  // /workspace/sum/cmgHJjOQtFig0da_bwBlK/gDAfqfmuke4HlDn-3hNrv
  router.push(`/workspace/sum/${item.formId}/${item.id}`);
};
</script>

<template>
  <ScrollArea class="max-h-[calc(100vh-120px)]">
    <section v-if="isLoading">
      <div class="flex justify-center items-center h-full">
        <Skeleton class="w-full h-full" />
      </div>
    </section>
    <section v-else class="entry w-full h-full p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">仪表盘</h1>
        <Button @click="handleCreateForm">
          <Icon icon="radix-icons:plus" class="mr-2 h-4 w-4" />
          创建表单
        </Button>
      </div>

      <div class="grid gap-4 ">
        <Card v-for="stat in stats" :key="stat.title">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">{{ stat.title }}</CardTitle>
            <Icon :icon="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <p class="text-xs text-muted-foreground">{{ stat.description }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-muted-foreground text-center py-8" v-if="sumSubmit.length === 0">
              暂无活动记录
            </div>
            <div v-else>
              <div v-for="item in sumSubmit.slice(0, 5)" :key="item.id">
                <Card @click="jumpToForm(item)" class="cursor-pointer">
                  <CardHeader>
                    <CardTitle>提交时间：{{ dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Avatar>
                      <AvatarImage :src="item.profiles.image" alt="用户头像" />
                      <AvatarFallback>{{ item.profiles.name }}</AvatarFallback>
                    </Avatar>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </ScrollArea>
</template>

<style scoped>
.entry {
  background-color: hsl(var(--background));
}
</style>
