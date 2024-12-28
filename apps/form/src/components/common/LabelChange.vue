<script setup lang="ts">
import { FormType } from '@/types/form'
import { watch } from 'vue'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import SelectItem from '../ui/select/SelectItem.vue'

const props = defineProps<{
  label: string
  type: 'text' | 'number' | 'checkbox' | 'select'
  placeholder: string
  options?: { label: string; value: string }[]
  changeType: FormType
  updateList: (type: FormType, newValue: string | boolean | number | undefined) => void
}>()
const model = defineModel<string | boolean | number | undefined>()
watch(model, (newVal) => {
  props.updateList(props.changeType, newVal)
})
</script>
<template>
  <div>
    <label for="label">{{ props.label }}</label>
    <input
      v-if="type === 'text'"
      v-model="model"
      type="text"
      :placeholder="props.placeholder"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
    <input
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      v-else-if="type === 'number'"
      v-model.number="model"
      type="number"
    />
    <input v-else-if="type === 'checkbox'" v-model="model" type="checkbox" />
    <Select v-else-if="type === 'select'" class="w-full" v-model="model as string">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
