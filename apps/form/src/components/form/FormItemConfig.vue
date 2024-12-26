<script setup lang="ts">
import type { CreateFormItem } from '@/types/form'
import { FormType } from './FormCreate.vue'
import InputItem from './FormItem/InputItem.vue'
defineProps<{
  id: string
  data: CreateFormItem | undefined
  updateList2: (id: string, type: FormType, newValue: string | boolean) => void
}>()
</script>
<template>
  <div class="flex flex-col gap-2" v-if="data">
    <div v-if="data.type === 'input'">
      <InputItem :updateList2="updateList2" :id="id" :data="data" />
    </div>
    <div v-if="data.type === 'select'">
      <!-- <SelectItem :updateList2="updateList2" :id="id" :data="data" /> -->
    </div>

    <div v-if="data.type === 'checkbox'">
      <!-- <CheckboxItem :updateList2="updateList2" :id="id" :data="data" /> -->
    </div>
    <div v-if="data.type === 'radio'">
      <!-- <RadioItem :updateList2="updateList2" :id="id" :data="data" /> -->
    </div>
  </div>
</template>
