<script setup lang="ts">
import LabelChange from '@/components/common/LabelChange.vue';
import { AutoForm } from '@/components/ui/auto-form';
import type { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { getZodSchema } from '@/lib/form';
import type { FormType, Select } from '@/types/form';
import { Icon } from '@iconify/vue';
import { Trash2Icon } from 'lucide-vue-next';
import { nanoid } from 'nanoid';
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import type { ZodType } from 'zod';

const { toast } = useToast();
const newItem = ref('');
const activeItem = ref<string | null>(null);
const props = defineProps<{
  id: string;
  data: Select;
  updateList2: (
    id: string,
    type: FormType,
    newValue: string | boolean | number | undefined | { name: string; id: string }[],
  ) => void;
}>();
const list = ref(props.data?.options);
// 默认值
// const defaultValue = ref(props.data?.defaultValue)
// 占位符
const defaultPlaceholder = ref(props.data?.placeholder);
// 标签
const defaultLabel = ref(props.data?.label);
// 描述
const defaultDescription = ref(props.data?.description);
// 必填
const defaultIsRequired = ref(!props.data?.isRequired);
// 隐藏标签
const defaultIsHidden = ref(props.data?.hiddenLabel);

// 表单数据
const schema = ref<ZodType<any> | null | undefined>(null);
// 表单配置
const fieldConfig = ref<Record<string, any>>({});
watch(
  () => props.data,
  (newValue) => {
    // defaultValue.value = newValue?.defaultValue
    defaultPlaceholder.value = newValue?.placeholder;
    defaultLabel.value = newValue?.label;
    defaultDescription.value = newValue?.description;
    defaultIsRequired.value = newValue?.isRequired;
    defaultIsHidden.value = newValue?.hiddenLabel;
    list.value = newValue?.options;
  },
);
schema.value = getZodSchema(props.data, fieldConfig);
const updateSchema = () => {
  props.updateList2(props.id, 'options', list.value);
  schema.value = getZodSchema(props.data, fieldConfig);
  // console.log(schema.value, fieldConfig.value)
};
// 监听默认值
watch(list, (newValue) => {
  props.updateList2(props.id, 'options', newValue);
  updateSchema();
});
// watch(defaultValue, (newValue) => {
//   props.updateList2(props.id, 'options', newValue)
//   updateSchema()
// })
watch(defaultIsHidden, (newValue) => {
  props.updateList2(props.id, 'hiddenLabel', newValue);
  updateSchema();
});
// 删除选项
const delectItem = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id);
  updateSchema();
};
// 更新选项
const updateItem = (id: string, value: string) => {
  list.value = list.value.map((item) => (item.id === id ? { ...item, name: value } : item));
  updateSchema();
};
// 添加选项
const addItem = () => {
  if (newItem.value) {
    if (list.value.find((item) => item.name === newItem.value)) {
      toast({
        title: '选项值已存在',
        variant: 'destructive',
      });
      return;
    }
    list.value.push({
      name: newItem.value,
      id: nanoid(),
    });
    updateSchema();
    newItem.value = '';
  } else {
    toast({
      title: '请输入选项值',
      variant: 'destructive',
    });
  }
};
const updateList = (type: FormType, newValue: string | boolean | number | undefined) => {
  // console.log(newValue, type);
  props.updateList2(props.id, type, newValue);
  updateSchema();
};
</script>
<template>
  <AutoForm v-if="schema" :schema="schema as ZodObjectOrWrapped" :fieldConfig="fieldConfig" />

  <section class="p-4 flex flex-col gap-2">
    <!-- 占位符 -->
    <LabelChange
      :updateList="updateList"
      changeType="placeholder"
      v-model="defaultPlaceholder"
      label="输入框占位符"
      type="text"
      placeholder="请输入占位符"
    />
    <!-- 枚举 -->
    <p class="flex items-center">
      <span>选项</span>
      <!-- <span class="text-gray-500 ml-auto">默认值 </span> -->
    </p>
    <VueDraggable
      ref="el"
      v-model="list"
      :animation="150"
      :disabled="activeItem !== null"
      ghostClass="ghost"
      class="flex flex-col gap-2 p-4 w-full m-auto bg-gray-500/5 rounded"
    >
      <Button
        v-for="(item, index) in list"
        :key="item.id"
        variant="outline"
        class="cursor-move relative h-30 text-left bg-gray-500/5 rounded p-3 grid grid-cols-[15px_1fr_20px]"
      >
        <span class="flex-1">
          <Icon icon="material-symbols-light:drag-pan-rounded" />
        </span>
        <input
          class="flex h-9 border-0 w-full rounded-md dark:hover:bg-white/5 hover:bg-gray-500/15 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          :value="item.name"
          @focus="activeItem = item.id"
          @blur="activeItem = null"
          @change="updateItem(item.id, ($event.target as HTMLInputElement).value)"
        />
        <button @click.stop="delectItem(item.id)" class="absolute right-0 top-0">
          <Trash2Icon class="w-4 h-4" />
        </button>
      </Button>
      <div class="flex gap-2">
        <input
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-6 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          placeholder="请输入选项值"
          v-model="newItem"
        />
        <Button variant="outline" @click="addItem">添加</Button>
      </div>
    </VueDraggable>
    <!-- 标签 -->
    <div class="flex w-full items-center gap-2">
      <input
        type="checkbox"
        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        v-model="defaultIsHidden"
      />
      隐藏标签
    </div>
    <LabelChange
      v-if="!defaultIsHidden"
      :updateList="updateList"
      changeType="description"
      v-model="defaultDescription"
      label="下拉框标签"
      type="text"
      placeholder="请输入标签"
    />
    <LabelChange
      :updateList="updateList"
      changeType="isRequired"
      v-model="defaultIsRequired"
      :default="defaultIsRequired"
      label="是否必填"
      type="checkbox"
      placeholder="请输入是否必填"
    />
  </section>
</template>
