<script setup lang="ts">
import type { CreateFormItem, FormType, Array } from '@/types/form'
import InputItem from './FormItem/InputItem.vue'
import SelectItem from './FormItem/SelectItem.vue'
import DateItem from './FormItem/DateItem.vue'
import BigText from './FormItem/BigText.vue'
import { type DateValue } from '@internationalized/date'
import ObjectItem from './FormItem/Object.vue'
import OneClick from './FormItem/OneClick.vue'
// @ts-ignore
import Switch from './FormItem/switch.vue'
import FileItem from './FormItem/FileItem.vue'

const props = defineProps<{
  id: string[]
  data: CreateFormItem | undefined
  updateList: (
    id: string[],
    type: FormType,
    newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
  ) => void
}>()
const updateList2 = (
  id: string,
  type: FormType,
  newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
) => {
  props.updateList(props.id, type, newValue)
}
</script>
<template>
  <div class="flex flex-col pb-20 gap-2" v-if="data">
    <section v-if="data.type === 'input'">
      <InputItem :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'select'">
      <SelectItem :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'date'">
      <DateItem :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'bigText'">
      <BigText :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'slider'">
      <Switch :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'file'">
      <FileItem :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'radio'">
      <OneClick :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
    <section v-if="data.type === 'array'">
      <ObjectItem :updateList2="updateList2" :id="id[1]" :data="data" />
    </section>
  </div>
</template>
