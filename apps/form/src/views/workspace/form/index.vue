<script setup lang="ts">
import Table from '@/components/table/Table.vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetrBoard } from '@/hooks/board'
import { Plus } from 'lucide-vue-next'
import useUser from '@/stores/user'
const { userDate } = useUser()
const { data, isLoading, error } = useGetrBoard(userDate?.session.user.id)
</script>
<template>
  <section v-if="isLoading">
    <Skeleton class="h-[80dvh] entry" />
  </section>
  <section v-else-if="error">
    <div class="flex flex-col items-center justify-center h-screen entry">
      <h1 class="text-2xl font-bold">错误</h1>
      <p class="text-gray-500">{{ error.message }}</p>
    </div>
  </section>
  <section v-else-if="Array.isArray(data)">
    <div class="flex items-center justify-between entry">
      <h1 class="text-2xl font-bold">表单列表</h1>
      <Button variant="outline" class="flex items-center gap-2">
        <RouterLink to="/workspace/create">
          <Plus />
          <span>创建表单</span>
        </RouterLink>
      </Button>
    </div>
    <Table :data="data" />
  </section>
</template>
