<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { getFormDataById, getZodSchema } from '@/lib/utils'
import { CreateFormItem } from '@/types/form'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as z from 'zod'
const route = useRoute()
const id = ref(route.params.id)
const formData = ref<CreateFormItem[] | null>(null)
const loading = ref(true)
const fieldConfig = ref<Record<string, any>>({})
const shemas = ref<z.ZodObject<any, any, any, any>>(z.object({}))
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId
  },
)
onBeforeMount(async () => {
  const formDatas = JSON.parse((await getFormDataById(id.value as string))?.schema || '{}')
  if (formDatas) formData.value = formDatas
  if (formData.value) {
    formData.value.forEach((item) => {
      const schema = getZodSchema(item, fieldConfig)

      if (schema) {
        shemas.value = shemas.value.merge(schema)
      }
    })
  }
  loading.value = false
})

const schema = z.object({
  username: z.string().min(2),
})
console.log(schema, shemas.value)
// const fieldConfig = {
//   password: {
//     label: 'Your secure password',
//     inputProps: {
//       type: 'password',
//       placeholder: '••••••••',
//     },
//   },
//   favouriteNumber: {
//     description: 'Your favourite number between 1 and 10.',
//   },
//   acceptTerms: {
//     label: 'Accept terms and conditions.',
//     inputProps: {
//       required: true,
//     },
//   },

//   birthday: {
//     description: 'We need your birthday to send you a gift.',
//   },

//   sendMeMails: {
//     component: 'switch',
//   },

//   bio: {
//     component: 'textarea',
//   },

//   marshmallows: {
//     label: 'How many marshmallows fit in your mouth?',
//     component: 'radio',
//   },

//   file: {
//     label: 'Text file',
//     component: 'file',
//   },
// }
const handleSubmit = (e: any) => {
  console.log(e)
}
</script>

<template>
  <ScrollArea class="h-[calc(100dvh-120px)] flex px-10 overflow-hidden" v-if="!loading">
    <section class="h-full px-2">
      <AutoForm
        class="w-full space-y-6"
        @submit="handleSubmit"
        :schema="shemas as z.ZodObject<any, any, any, any>"
        :field-config="fieldConfig"
        v-if="formData"
      >
        <Button type="submit" class="w-full" variant=""> 提交 </Button>
      </AutoForm>
      <div v-else>
        <p>暂无数据</p>
      </div>
    </section>
  </ScrollArea>
  <Skeleton v-else class="h-[calc(100dvh-120px)] flex px-10 overflow-hidden" />
</template>
