<script setup lang="ts">
import LabelChange from '@/components/common/LabelChange.vue';
import { AutoForm } from '@/components/ui/auto-form';
import type { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils';
import { getZodSchema } from '@/lib/form';
import type { DatePicker, FormType } from '@/types/form';
import type { DateValue } from '@internationalized/date';
import { ref, watch } from 'vue';
import type { ZodType } from 'zod';
const props = defineProps<{
  id: string;
  data: DatePicker;
  updateList2: (
    id: string,
    type: FormType,
    newValue: string | boolean | number | undefined | DateValue,
  ) => void;
}>();
// 默认值
// 占位符
const defaultPlaceholder = ref(props.data?.placeholder);
// 标签
const defaultLabel = ref(props.data?.label);
// 描述
const defaultDescription = ref(props.data?.description);
// 必填
const defaultIsRequired = ref(props.data?.isRequired);
// 隐藏标签
const defaultIsHidden = ref(props.data?.hiddenLabel);
// 下边文字
// const defaultUnderText = ref(props.data?.underText)
// 表单数据
const schema = ref<ZodType<any> | null | undefined>(null);
// 表单配置
const fieldConfig = ref<Record<string, any>>({});
watch(
  () => props.data,
  (newValue) => {
    // 默认值
    // 占位符
    defaultPlaceholder.value = newValue?.placeholder;
    // 标签
    defaultLabel.value = newValue?.label;
    // 描述
    defaultDescription.value = newValue?.description;
    // 必填
    defaultIsRequired.value = newValue?.isRequired;
    // 隐藏标签
    defaultIsHidden.value = newValue?.hiddenLabel;
    // 下边文字
    // defaultUnderText.value = newValue?.underText
  },
);
// 默认值
schema.value = getZodSchema(props.data, fieldConfig);
const updateSchema = () => {
  schema.value = getZodSchema(props.data, fieldConfig);
};
const updateList = (
  type: FormType,
  newValue: string | boolean | number | undefined | DateValue,
) => {
  props.updateList2(props.id, type, newValue);
  updateSchema();
};
</script>
<template>
  <AutoForm v-if="schema" :schema="schema as ZodObjectOrWrapped" :fieldConfig="fieldConfig" />
  <section class="p-4 flex flex-col gap-2">
    <LabelChange
      :updateList="updateList"
      changeType="hiddenLabel"
      v-model="defaultIsHidden"
      label="是否隐藏标签"
      type="checkbox"
      placeholder="请输入是否隐藏标签"
    />
    <LabelChange
      v-if="!defaultIsHidden"
      :updateList="updateList"
      changeType="description"
      v-model="defaultDescription"
      label="输入框标签"
      type="text"
      placeholder="请输入标签"
    />
    <LabelChange
      :updateList="updateList"
      changeType="isRequired"
      v-model="defaultIsRequired"
      label="是否必填"
      type="checkbox"
      placeholder="请输入是否必填"
    />
  </section>
</template>
