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
  default?: string | boolean | number | undefined
  updateList: (type: FormType, newValue: string | boolean | number | undefined) => void
}>()
const model = defineModel<string | boolean | number | undefined>()
watch(model, (newVal) => {
  props.updateList(props.changeType, newVal)
})
</script>
<template>
  <div>
    <label for="label" v-if="props.type !== 'checkbox'">{{ props.label }}</label>
    <input
      v-if="type === 'text'"
      v-model="model"
      type="text"
      :placeholder="props.placeholder"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
    <input
      v-else-if="type === 'number'"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      v-model.number="model"
      type="number"
    />
    <div v-else-if="type === 'checkbox'" class="flex items-center gap-2">
      <input
        v-model="model"
        :default-value="props.default"
        type="checkbox"
        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      <label for="label">{{ props.label }}</label>
    </div>
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
