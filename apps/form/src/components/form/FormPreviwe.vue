<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { getZodSchema } from '@/lib/form'
import { type CreateFormItem } from '@/types/form'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'

const router = useRouter()
const loading = ref(true)
const fieldConfig = ref<Record<string, any>>({})
const props = defineProps<{
  schema: string
}>()
const emit = defineEmits(['submit'])
const formData = ref<CreateFormItem[] | null>(JSON.parse(props.schema))
const CreateShemas = ref<z.ZodObject<any, any, any, any>>(z.object({}))

onBeforeMount(async () => {
  formData?.value?.forEach((item) => {
    const schema = getZodSchema(item, fieldConfig) as z.ZodObject<any, any, any, any>
    if (schema) CreateShemas.value = CreateShemas?.value?.merge(schema)
  })
  loading.value = false
})
</script>

<template>
  <ScrollArea class="max-h-[calc(100dvh-600px)] flex px-10 overflow-hidden entry" v-if="!loading">
    <section class="h-full px-2" v-if="formData && Object.keys(formData).length">
      <AutoForm
        class="w-full space-y-6"
        @submit="emit('submit', $event)"
        :schema="CreateShemas as z.ZodObject<any, any, any, any>"
        :field-config="fieldConfig"
      >
        <Button type="submit" class="w-full py-2 transition-all" variant="outline"> 提交 </Button>
      </AutoForm>
    </section>
    <div v-else class="flex flex-col items-center justify-center max-h-[calc(100dvh-600px)]">
      <p class="text-center text-sm text-gray-500">暂无数据</p>
      <Button class="w-[100px] py-2 transition-all" @click="router.back()"> 返回 </Button>
    </div>
  </ScrollArea>
  <Skeleton v-else class="max-h-[calc(100dvh-600px)] flex px-10 overflow-hidden" />
</template>
