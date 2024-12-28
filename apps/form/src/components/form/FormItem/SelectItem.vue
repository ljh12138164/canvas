<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { ZodObjectOrWrapped } from '@/components/ui/auto-form/utils'
import { Button } from '@/components/ui/button'
import { getZodSchema } from '@/lib/form'
import { selectDefaultValue } from '@/types/form'
import { Label } from '@/components/ui/label'
import { CreateFormItem, FormType } from '@/types/form'
import { Trash2Icon } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { nanoid } from 'nanoid'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const list = ref(selectDefaultValue)
const newItem = ref('')
const activeItem = ref<string | null>(null)
const props = defineProps<{
  id: string
  data: CreateFormItem
  updateList2: (id: string, type: FormType, newValue: string | boolean | number | undefined) => void
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
// 隐藏标签
const defaultIsHidden = ref(props.data?.hiddenLabel)

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
watch(defaultIsHidden, (newValue) => {
  schema.value = null
  props.updateList2(props.id, 'hiddenLabel', newValue as boolean)
  updateSchema()
})

const delectItem = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
const updateItem = (id: string, value: string) => {
  list.value = list.value.map((item) => (item.id === id ? { ...item, name: value } : item))
}
const addItem = () => {
  if (newItem.value) {
    if (list.value.find((item) => item.name === newItem.value)) {
      toast({
        title: '选项值已存在',
        variant: 'destructive',
      })
      return
    }
    list.value.push({
      name: newItem.value,
      id: nanoid(),
    })
    newItem.value = ''
  } else {
    toast({
      title: '请输入选项值',
      variant: 'destructive',
    })
  }
}
const updateList = (type: FormType, newValue: string | boolean | number | undefined) => {
  props.updateList2(props.id, type, newValue)
  updateSchema()
}
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
    <span>选项</span>
    <VueDraggable
      ref="el"
      v-model="list"
      :animation="150"
      :disabled="activeItem !== null"
      ghostClass="ghost"
      class="flex flex-col gap-2 p-4 w-full m-auto bg-gray-500/5 rounded"
    >
      <Button
        v-for="item in list"
        :key="item.id"
        variant="outline"
        class="cursor-move relative h-30 text-left bg-gray-500/5 rounded p-3"
      >
        <span class="flex-1">
          <Icon icon="material-symbols-light:drag-pan-rounded" />
        </span>
        <input
          class="flex h-9 border-0 w-[calc(100%-20px)] rounded-md dark:hover:bg-white/5 hover:bg-gray-500/15 border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
    <div v-if="!defaultIsHidden">
      <Label for="description" class="text-sm">输入框标签</Label>
      <input
        class="'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'"
        id="description"
        v-model="defaultDescription"
        placeholder="请输入标签"
      />
    </div>
  </section>
</template>
