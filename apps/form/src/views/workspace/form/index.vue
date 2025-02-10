<script setup lang="ts">
import Table from '@/components/table/Table.vue';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetrBoard } from '@/hooks/board';
import { Plus, RefreshCw } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
const { data, isLoading, error } = useGetrBoard();
const handleRefresh = () => {
  window.location.reload();
  // queryClient.invalidateQueries({ queryKey: ["board"] });
};
</script>
<template>
  <section v-if="isLoading">
    <Skeleton class="h-[80dvh]" />
  </section>
  <section v-else-if="error" class="entry">
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-2xl font-bold">错误</h1>
      <p class="text-gray-500">{{ error.message }}</p>
    </div>
  </section>
  <section v-else-if="Array.isArray(data)" class="entry">
    <div class="flex items-center justify-between">
      <section class="flex gap-2">
        <h1 class="text-2xl font-bold">表单列表</h1>
        <Button
          variant="outline"
          class="flex items-center gap-2"
          @click="handleRefresh"
        >
          <RefreshCw />
          <span>刷新</span>
        </Button>
      </section>
      <RouterLink to="/workspace/create">
        <Button variant="outline" class="flex items-center gap-2">
          <Plus />
          <span>创建表单</span>
        </Button>
      </RouterLink>
    </div>
    <Table :data="data" />
  </section>
</template>
