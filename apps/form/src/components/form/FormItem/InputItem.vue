<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getZodSchema } from '@/lib/utils'
import { CreateFormItem, FormType } from '@/types/form'
import { ref, watch } from 'vue'

const props = defineProps<{
  id: string
  data: CreateFormItem
  updateList2: (id: string, type: FormType, newValue: string | boolean) => void
}>()
// 默认值
const defaultValue = ref(props.data?.defaultValue)
// 占位符
const defaultPlaceholder = ref(props.data?.placeholder)
// 标签
const defaultLabel = ref(props.data?.label)
// 描述
const defaultDescription = ref(props.data?.description)
// 必填
const defaultIsRequired = ref(!props.data?.isRequired)

// 表单数据
const schema = ref<ZodObjectOrWrapped | null>(null)
// 表单配置
const fieldConfig = ref<Record<string, any>>({})
watch(
  () => props.data,
  (newValue) => {
    defaultValue.value = newValue?.defaultValue
    defaultPlaceholder.value = newValue?.placeholder
    defaultLabel.value = newValue?.label
    defaultDescription.value = newValue?.description
    defaultIsRequired.value = newValue?.isRequired
  },
)
schema.value = getZodSchema(props.data, fieldConfig)
const updateSchema = () => {
  schema.value = getZodSchema(props.data, fieldConfig)
  // console.log(schema.value, fieldConfig.value)
}
// 监听默认值
watch(defaultValue, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'defaultValue', newValue as string)
  updateSchema()
})
watch(defaultPlaceholder, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'placeholder', newValue as string)
  updateSchema()
})
watch(defaultLabel, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'label', newValue as string)
  updateSchema()
})
watch(defaultDescription, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'description', newValue as string)
  updateSchema()
})
watch(defaultIsRequired, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'isRequired', !newValue as boolean)
  updateSchema()
})

const handleUpdateItem = (type: FormType, newValue: string | boolean) => {
  props.updateList2(props.id, type, newValue)
}
</script>
<template>
  <AutoForm v-if="schema" :schema="schema as ZodObjectOrWrapped" :fieldConfig="fieldConfig" />
  <section class="p-4 flex flex-col gap-2">
    <Label for="placeholder" class="text-sm">输入框占位符:</Label>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      id="placeholder"
      v-model="defaultPlaceholder"
      placeholder="请输入占位符"
    />
    <Label for="defaultValue" class="text-sm">输入框默认值</Label>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      id="defaultValue"
      v-model="defaultValue"
      placeholder="请输入默认值"
    />
    <!-- <Label :for="data?.label" class="text-sm">输入框标签名字</Label>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      :id="data?.label"
      v-model="defaultLabel"
      placeholder="请输入标签名字"
    /> -->
    <Label for="description" class="text-sm">输入框标签</Label>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      id="description"
      v-model="defaultDescription"
      placeholder="请输入标签"
    />

    <div class="flex w-full items-center gap-2">
      <input
        type="checkbox"
        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        v-model="defaultIsRequired"
      />
      是否必填
    </div>
  </section>
</template>
