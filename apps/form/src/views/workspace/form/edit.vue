<script setup lang="ts">
import FormCreate from '@/components/form/FormCreate.vue';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { useBoard } from '@/hooks/board';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { toast } = useToast();
const router = useRouter();
const route = useRoute();
const paramsId = ref<string>(route.params.id as string);

watch(
  () => route.params.id,
  () => {
    paramsId.value = route.params.id as string;
  },
  { immediate: true },
);
const { data, isLoading, error } = useBoard(paramsId.value);
const handleSubmit = (data: any) => {
  toast({
    title: data,
  });
};

const handleBack = () => {
  router.push('/workspace/form');
};
</script>

<template>
  <section v-if="isLoading" class="p-4">
    <div class="space-y-4">
      <Skeleton class="h-8 w-48" />
      <div class="space-y-3">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
      </div>
    </div>
  </section>
  <section v-else-if="error" class="p-4">
    <div class="text-center">
      <p class="text-red-500 mb-4">发生错误</p>
      <Button @click="handleBack">返回</Button>
    </div>
  </section>
  <section v-else-if="data?.schema" class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">{{ data.name || '表单编辑' }}</h1>
      <Button variant="outline" @click="handleBack">返回</Button>
    </div>
    <FormCreate
      :schema="data.schema"
      :id="data.id"
      :title="data.name"
      :description="data.description"
    />
  </section>
</template>
