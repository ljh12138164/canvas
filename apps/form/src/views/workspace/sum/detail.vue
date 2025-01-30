<script setup lang="ts">
import Show from '@/components/form/Submit/Show.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSubmitFormById } from '@/hooks/submit';
import ExcelJS from 'exceljs';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const id = ref<string>(route.params.id as string);
const detail = ref<string>(route.params.detail as string);
watch(
  () => route.params.id,
  () => {
    id.value = route.params.id as string;
  },
);
watch(
  () => route.params.detail,
  () => {
    detail.value = route.params.detail as string;
  },
);

const { data, isLoading } = useGetSubmitFormById(id.value);
const formData = computed(() => {
  if (!data.value) return;
  return data.value?.submit?.find((item) => item.id === detail.value);
});

function exports() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 10 },
    { header: 'Age', key: 'age', width: 10 },
  ];
  worksheet.addRows([
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ]);
  const fileWork = new FileReader();
  const file = new File(worksheet, 'myExcelFile.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
</script>
<template>
  <ScrollArea class="max-h-[calc(100dvh-150px)]">
    <nav class="flex gap-2 items-center">
      <h2 class="text-xl font-bold">提交记录：</h2>
      <Button @click="router.back()">返回</Button>
      <Button @click="exports()">导出</Button>
    </nav>
    <section v-if="isLoading">
      <Skeleton class="w-full h-12" />
    </section>
    <Show :submit="JSON.parse(formData.submit)" v-else-if="formData" />
  </ScrollArea>
</template>
