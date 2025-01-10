<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetrBoard } from "@/hooks/board";
import { Plus } from "lucide-vue-next";
// @ts-ignore
const { value: userDate, _object } = useSupabaseUser();
if (!userDate) navigateTo("/auth");
const token = _object.$ssupabase_session?.access_token!;
const { data, isLoading, error } = useGetrBoard(token, userDate?.id!);
</script>
<template>
  <section v-if="isLoading">
    <Skeleton class="h-[80dvh]" />
  </section>
  <section v-else-if="error">
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-2xl font-bold">错误</h1>
      <p class="text-gray-500">{{ error.message }}</p>
    </div>
  </section>
  <section v-else-if="Array.isArray(data)">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">表单列表</h1>
      <Button variant="outline" class="flex items-center gap-2">
        <NuxtLink to="/workspace/create">
          <Plus />
          <span>创建表单</span>
        </NuxtLink>
      </Button>
    </div>
    <Table :data="data" />
  </section>
</template>
