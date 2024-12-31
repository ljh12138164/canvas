<script setup lang="ts">
import type { CreateFormItem, FormType } from '@/types/form'
import InputItem from './FormItem/InputItem.vue'
import SelectItem from './FormItem/SelectItem.vue'
defineProps<{
  id: string
  data: CreateFormItem | undefined
  updateList2: (
    id: string,
    type: FormType,
    newValue: string | boolean | number | undefined | { name: string; id: string }[],
  ) => void
}>()
</script>
<template>
  <div class="flex flex-col pb-20 gap-2" v-if="data">
    <div v-if="data.type === 'input'">
      <InputItem :updateList2="updateList2" :id="id" :data="data" />
    </div>
    <div v-if="data.type === 'select'">
      <SelectItem :updateList2="updateList2" :id="id" :data="data" />
    </div>

    <div v-if="data.type === 'checkbox'">
      <!-- <CheckboxItem :updateList2="updateList2" :id="id" :data="data" /> -->
    </div>
    <div v-if="data.type === 'radio'">
      <!-- <RadioItem :updateList2="updateList2" :id="id" :data="data" /> -->
    </div>
  </div>
</template>
