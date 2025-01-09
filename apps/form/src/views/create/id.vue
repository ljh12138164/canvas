<script setup lang="ts">
import FormCreate from '@/components/form/FormCreate.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { useCreateBoard } from '@/hooks/board'
import useUser from '@/stores/user'
import { toTypedSchema } from '@vee-validate/zod'
import { Save } from 'lucide-vue-next'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as z from 'zod'
const { toast } = useToast()
const token = useUser().userData?.session.access_token as string
const route = useRoute()
const id = ref(route.params.id)
const { mutate: createBoard } = useCreateBoard(token)
const schema = ref<any>('')

// 定义表单验证架构
const validationSchema = toTypedSchema(
  z.object({
    title: z.coerce.string().min(2, '标题至少需要2个字符').max(50, '标题不能超过50个字符'),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  }),
)

// 使用vee-validate的useForm和useField
const { handleSubmit, resetForm, errors, values } = useForm({
  validationSchema,
  initialValues: {
    title: '',
    description: '',
  },
})

// 获取字段
const { value: title } = useField<string>('title')
const { value: description } = useField<string>('description')

// 提交处理函数
const onSubmit = handleSubmit((values) => {
  if (schema.value.length === 2) {
    toast({
      title: '请先填写表单',
      variant: 'destructive',
    })
    return
  } else {
    // createBoard({
    //   json: {
    //     name: values.title,
    //     schema: JSON.stringify(schema.value),
    //     description: values.description,
    //   },
    // })
  }
})

const updateSchema = (data: any) => {
  schema.value = data
  console.log('schema updated to:', data)
}

// 在 script setup 中添加 watch
watch(
  schema,
  (newSchema) => {
    console.log('schema updated:', newSchema)
  },
  { deep: true },
)
</script>

<template>
  <FormCreate :updateSchema="updateSchema" />
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" class="w-full">
        <Save class="mr-2 h-4 w-4" />
        <span>保存</span>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>填写表单信息</DialogTitle>
        <form @submit="onSubmit" class="space-y-4 mt-4">
          <div class="space-y-2">
            <label for="title" class="text-sm font-medium">标题</label>
            <Input
              v-model="title"
              name="title"
              type="text"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="请输入表单标题"
            />
            <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
          </div>

          <div class="space-y-2">
            <label for="description" class="text-sm font-medium">描述</label>
            <Textarea
              v-model="description"
              name="description"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="请输入表单描述"
              rows="3"
            />
            <span v-if="errors.description" class="text-sm text-red-500">{{
              errors.description
            }}</span>
          </div>
        </form>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit" @click="onSubmit">创建</Button>
        <DialogClose>
          <Button variant="ghost" @click="resetForm">取消</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
