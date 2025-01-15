<script setup lang="ts">
import LabelChange from '@/components/common/LabelChange.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { type ZodObjectOrWrapped } from '@/components/ui/auto-form/utils'
import { getZodSchema } from '@/lib/form'
import { type Array, type FormType } from '@/types/form'
import { type DateValue } from '@internationalized/date'
import { ref, watch } from 'vue'
import { type ZodType } from 'zod'

// 表单配置
const fieldConfig = ref<Record<string, any>>({})
const props = defineProps<{
  id: string
  data: Array
  updateList2: (
    id: string,
    type: FormType,
    newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
  ) => void
}>()
const schema = ref<ZodType<any> | null | undefined>(null)
const defaultDescription = ref(props.data?.description)
watch(
  () => props.data,
  (newValue) => {
    // defaultValue.value = newValue?.defaultValue
    defaultDescription.value = newValue?.description
  },
)
schema.value = getZodSchema(props.data, fieldConfig)
const updateSchema = () => {
  // props.updateList2(props.id, 'description', defaultDescription.value)
  schema.value = getZodSchema(props.data, fieldConfig)
}
const updateList = (
  type: FormType,
  newValue: string | boolean | number | undefined | DateValue,
) => {
  props.updateList2(props.id, type, newValue)
  updateSchema()
}
</script>
<template>
  <AutoForm v-if="schema" :schema="schema as ZodObjectOrWrapped" :fieldConfig="fieldConfig" />
  <section class="p-4 flex flex-col gap-2">
    <!-- 枚举 -->
    <LabelChange
      :updateList="updateList"
      changeType="description"
      v-model="defaultDescription"
      label="下拉框标签"
      type="text"
      placeholder="请输入标签"
    />
  </section>
</template>
