<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormType, useForm } from '@/stores/form'
import { CreateFormItem, FormItem } from '@/types/form'
import { ref, watch } from 'vue'

const props = defineProps<{
  id: string
  data: CreateFormItem
  updateList2: (id: string, type: FormType, newValue: string | boolean) => void
}>()
const defaultValue = ref(props.data?.defaultValue)
const defaultPlaceholder = ref(props.data?.placeholder)

watch(
  () => props.data,
  (newValue) => {
    defaultValue.value = newValue?.defaultValue
    defaultPlaceholder.value = newValue?.placeholder
  },
)
watch(defaultValue, (newValue) => {
  props.updateList2(props.id, 'defaultValue', newValue as string)
})
watch(defaultPlaceholder, (newValue) => {
  props.updateList2(props.id, 'placeholder', newValue as string)
})
const handleUpdateItem = (type: FormType, newValue: string | boolean) => {
  props.updateList2(props.id, type, newValue)
}
</script>
<template>
  <section class="p-4 flex flex-col gap-2">
    <div>{{ data }}</div>
    <Label :for="data?.id" class="text-sm">输入框标签名字:</Label>
    <p>{{ defaultValue }}</p>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      :id="data?.id"
      v-model="defaultValue"
      @change="(e) => handleUpdateItem('label', (e.target as HTMLInputElement).value)"
      :placeholder="data?.placeholder"
    />
    <Label :for="data?.id" class="text-sm">输入框默认值</Label>
    <input
      class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
      :id="data?.id"
      v-model="defaultPlaceholder"
      :placeholder="data?.placeholder"
    />
    <div class="flex w-full items-center gap-2">
      <Checkbox
        :checked="data?.isRequired"
        @update:checked="handleUpdateItem('isRequired', !data?.isRequired)"
      />
      是否必填
    </div>
  </section>
</template>
