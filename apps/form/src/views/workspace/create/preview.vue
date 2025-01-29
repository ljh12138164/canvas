<script setup lang="ts">
import { AutoForm, getBaseType } from '@/components/ui/auto-form';
import Button from '@/components/ui/button/Button.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast/use-toast';
import { getFileType, getZodSchema } from '@/lib/form';
import { getFormDataById } from '@/lib/index';
import type { CreateFormItem } from '@/types/form';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as z from 'zod';

const { toast } = useToast();
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const formData = ref<CreateFormItem[] | null>(null);
const loading = ref(true);
const fieldConfig = ref<Record<string, any>>({});
const shemas = ref<z.ZodObject<any, any, any, any>>(z.object({}));
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId;
  },
);
onBeforeMount(async () => {
  const formDatas = JSON.parse((await getFormDataById(id.value as string))?.schema || '{}');
  if (formDatas) formData.value = formDatas;
  if (formData.value && Object.keys(formData.value).length) {
    formData?.value.forEach((item) => {
      const schema = getZodSchema(item, fieldConfig) as z.ZodObject<any, any, any, any>;
      if (schema) {
        shemas.value = shemas.value.merge(schema);
      }
    });
  }
  loading.value = false;
});

const handleSubmit = (e: any) => {
  const newInputs = Object.entries(e).map(([key, value]) => {
    if (key.startsWith('文件')) {
      if (!value) return;
      const newvalue = getFileType(value as string);
      return [key, newvalue];
    }
    return [key, value];
  });
  toast({
    title: '提交成功',
    description: JSON.stringify(newInputs),
  });
};
</script>

<template>
  <ScrollArea class="h-[calc(100dvh-120px)] flex px-10 overflow-hidden entry" v-if="!loading">
    <section class="h-full px-2" v-if="formData && Object.keys(formData).length">
      <AutoForm class="w-full space-y-6" @submit="handleSubmit" :schema="shemas as z.ZodObject<any, any, any, any>"
        :field-config="fieldConfig">
        <div class="flex justify-end gap-2">
          <Button @click="router.back()" class="w-full py-2 transition-all" type="button" variant="outline">
            返回
          </Button>
          <Button type="submit" class="w-full py-2 transition-all"> 提交 </Button>
        </div>
      </AutoForm>
    </section>
    <div v-else class="flex flex-col items-center justify-center h-[calc(100dvh-120px)]">
      <p class="text-center text-sm text-gray-500">暂无数据</p>
      <Button class="w-[100px] py-2 transition-all" @click="router.back()"> 返回 </Button>
    </div>
  </ScrollArea>
  <Skeleton v-else class="h-[calc(100dvh-120px)] flex px-10 overflow-hidden" />
</template>
