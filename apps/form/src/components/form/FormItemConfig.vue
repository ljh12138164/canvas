<script setup lang="ts">
import type { CreateFormItem, FormType } from '@/types/form';
import type { DateValue } from '@internationalized/date';
import BigText from './FormItem/BigText.vue';
import DateItem from './FormItem/DateItem.vue';
import FileItem from './FormItem/FileItem.vue';
import InputItem from './FormItem/InputItem.vue';
import ObjectItem from './FormItem/Object.vue';
import OneClick from './FormItem/OneClick.vue';
import SelectItem from './FormItem/SelectItem.vue';
// @ts-ignore
import Switch from './FormItem/switch.vue';

defineProps<{
  id: string;
  data: CreateFormItem | undefined;
  updateList2: (
    id: string,
    type: FormType,
    newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
  ) => void;
}>();
</script>
<template>
  <div class="flex flex-col pb-20 gap-2" v-if="data">
    <section v-if="data.type === 'input'">
      <InputItem :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'select'">
      <SelectItem :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'date'">
      <DateItem :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'bigText'">
      <BigText :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'slider'">
      <Switch :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'file'">
      <FileItem :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'radio'">
      <OneClick :updateList2="updateList2" :id="id" :data="data" />
    </section>
    <section v-if="data.type === 'obj'">
      <ObjectItem :updateList2="updateList2" :id="id" :data="data" />
    </section>
  </div>
</template>
