<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSubmitFormById } from '@/hooks/submit';
import { downLoad } from '@/lib';
import type { FileType } from '@/types/form';
import { encode } from 'base64-arraybuffer';
import dayjs from 'dayjs';
import { LucideDownload } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const id = ref<string>(route.params.id as string);
watch(
  () => route.params.id,
  () => {
    id.value = route.params.id as string;
  },
);

const { data, isLoading } = useGetSubmitFormById(id.value);

/**
 * ### 导出
 */
async function exports() {
  if (!data.value) return;
  // 动态导入
  const { Workbook } = await import('exceljs');
  const workbook = new Workbook();
  for (const item of data.value.submit) {
    // 创建工作表
    const worksheet = workbook.addWorksheet(
      `${item.profiles.name}-${dayjs(item.created_at).format('YYYY年MM月DD日 HH:mm:ss')}`.replace(
        /[\*\?:\\\/\[\]]/g,
        '',
      ),
    );
    // 获取提交数据
    const sumbitForm = JSON.parse(item.submit) as Record<string, FileType>;
    const columns = [
      { header: '姓名', key: 'name', width: 20 },
      { header: '邮箱', key: 'email', width: 20 },
    ];
    const rows = [{ name: item.profiles.name, email: item.profiles.email }];
    // 设置表头
    for (const [key, value] of Object.entries(sumbitForm)) {
      if (!value.type) {
        Object.entries(value).forEach(([label, values]) => {
          if (value.type === 'file') {
            columns.push({ header: value.label, key: `key-${label}`, width: 20 });
            rows[0] = { ...rows[0], [`key-${label}`]: values.file };
          } else {
            columns.push({ header: label, key: `key-${label}`, width: 20 });
            rows[0] = { ...rows[0], [`key-${label}`]: values.SubmitValue };
          }
        });
        // 递归
      } else if (value.type === 'file') {
        columns.push({ header: value.label, key, width: 20 });
        rows[0] = { ...rows[0], [key]: value.file };
      } else {
        columns.push({ header: value.label, key, width: 20 });
        rows[0] = { ...rows[0], [key]: value.SubmitValue };
      }
    }
    // 添加用户信息
    worksheet.columns = columns;
    worksheet.addRows(rows);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${encode(buffer)}`;
  // 下载文件
  downLoad(base64, 'xlsx');
}
</script>
<template>
  <ScrollArea class="max-h-[calc(100dvh-150px)]">
    <nav class="flex gap-2 items-center">
      <h2 class="text-xl font-bold">提交记录：</h2>
      <Button @click="router.back()">返回</Button>
      <Button @click="exports" :disabled="!data?.submit.length" variant="outline" class="ml-auto">
        <LucideDownload :size="18" />
        导出为Excel
      </Button>
    </nav>
    <section v-if="isLoading" class="flex flex-col gap-2">
      <Skeleton class="w-full h-12" />
      <Skeleton class="w-full h-12" />
      <Skeleton class="w-full h-12" />
      <Skeleton class="w-full h-12" />
      <Skeleton class="w-full h-12" />
    </section>
    <section class="flex flex-col gap-2" v-else-if="data?.submit.length">
      <Card v-for="item in data.submit" @click="router.push(`/workspace/sum/${data.id}/${item.id}`)"
        class=" cursor-pointer">
        <CardHeader>
          <CardTitle>提交时间：{{ dayjs(item.created_at).format('YYYY年MM月DD日 HH:mm:ss') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <Avatar>
            <AvatarImage :src="item.profiles.image" alt="提交人姓名" />
            <AvatarFallback>{{ item.profiles.name.slice(0, 2) }}</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
    </section>
    <section v-else class="flex justify-center items-center h-full">
      无提交
    </section>
  </ScrollArea>
</template>