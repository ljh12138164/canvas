import { Config } from '@/components/ui/auto-form'
import { CreateFormItem, FormInput, FormItem } from '@/types/form'
import type { Updater } from '@tanstack/vue-query'
import { type ClassValue, clsx } from 'clsx'
import localforage from 'localforage'
import { nanoid } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import type { Ref } from 'vue'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// @ts-ignore
export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

localforage.config({
  name: 'ljh-form',
  storeName: 'ljh-form',
})

interface IndexDBChanagePros {
  type: 'add' | 'delete' | 'edit'
  data?: {
    id: string
    schema: string
  }
  deletItem?: string
  editData?: {
    id: string
    schema: string
  }
}
/**
 * 更新indexDB
 * @param type 类型
 * @param data 数据
 * @param deletItem 删除的id
 * @param editData 编辑的数据
 * @returns
 */
export function indexDBChange({ type, data, deletItem, editData }: IndexDBChanagePros) {
  if (type === 'delete' && deletItem) {
    return localforage.removeItem(deletItem)
  }
  if (type === 'add' && data) {
    return localforage.setItem(data.id, data)
  }
  if (type === 'edit' && editData) {
    localforage.removeItem(editData.id)
    return localforage.setItem(editData.id, editData)
  }
}
/**
 * 获取indexDB数据
 * @returns 数据
 */
export async function getIndexDB() {
  const arr: { id: string; schema: string }[] = []
  await localforage.iterate((res: { id: string; schema: string }) => {
    arr.push(res)
  })
  return arr
}
/**
 * 获取指定id的数据
 * @param id 数据id
 * @returns 数据
 */
export async function getFormDataById(id: string) {
  return await localforage.getItem<{ id: string; schema: string }>(id)
}

/**
 * ### 是否有描述
 * @param
 */
export const hasDescription = (schema: Zod.ZodType, value: string) => {
  if (value) return schema.describe(value)
  return schema
}
/**
 * ### 是否必选
 * @param schema zod
 * @param value 描述
 * @returns zod
 */
export const hasOptional = (schema: Zod.ZodType, value: boolean) => {
  if (value) return schema.optional()
  return schema
}

/**
 * ## 生成input的zod校验
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 **/
export const inputZod = function (schema: FormInput, fieldConfig: Ref<Record<string, any>>) {
  let obj: Record<string | 'inputProps', any> = {
    inputProps: {},
  }
  let zodSchema
  // 文本
  if (schema.inputType === 'text') {
    zodSchema = z.string()
    obj.type = 'text'
    if (schema.isRequired) zodSchema = zodSchema.optional()
    else zodSchema = zodSchema.min(1)
    zodSchema = hasDescription(zodSchema, schema.description)
    if (schema.defaultValue) zodSchema = zodSchema.default(schema.defaultValue as string)
  }
  // 数字
  if (schema.inputType === 'number') {
    zodSchema = z.number()
    obj.type = 'number'
    if (schema.isRequired) zodSchema = zodSchema.optional()
    else zodSchema = zodSchema.min(1)
    zodSchema = hasDescription(zodSchema, schema.description)
    if (schema.defaultValue) zodSchema = zodSchema.default(schema.defaultValue as number)
  }
  // 标签
  if (schema.label) obj.inputProps.label = schema.label
  else {
    obj.inputProps.label = nanoid()
    obj.hideLabel = true
  }
  // 占位符
  if (schema.placeholder) obj.inputProps.placeholder = schema.placeholder
  // 隐藏标签
  if (schema.hiddenLabel) obj.hideLabel = true
  // 必填
  if (schema.isRequired) zodSchema = zodSchema?.optional()

  if (!Object.keys(obj.inputProps).length) delete obj.inputProps
  console.log(fieldConfig.value)
  fieldConfig.value = { ...fieldConfig.value, [schema.defaultTypeName]: obj }
  return zodSchema
}

/**
 * ## 生成zod校验
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 */
export function getZodSchema(schema: CreateFormItem, fieldConfig: Ref<Record<string, any>>) {
  // 输入框
  if (schema.type === 'input') {
    const zodSchema = inputZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 复选框
  if (schema.type === 'checkbox') return z.object({ [schema.name]: z.boolean() })
  // 单选框
  if (schema.type === 'radio') return z.object({ [schema.name]: z.string() })
  // 下拉框
  // if (schema.type === 'select') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'textarea') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'date') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'time') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'datetime') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'datetime-local') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'email') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'number') return z.string({ [schema.id]: z.number() })
  return null
}

/**
 * 获取fieldConfig
 * @returns fieldConfig
 */
export function getFieldConfig(schema: CreateFormItem, zod: z.ZodType) {
  return {}
}

// const fieldConfig = {
//   password: {
//     label: 'Your secure password',
//     inputProps: {
//       type: 'password',
//       placeholder: '••••••••',
//     },
//   },
//   favouriteNumber: {
//     description: 'Your favourite number between 1 and 10.',
//   },
//   acceptTerms: {
//     label: 'Accept terms and conditions.',
//     inputProps: {
//       required: true,
//     },
//   },

//   birthday: {
//     description: 'We need your birthday to send you a gift.',
//   },

//   sendMeMails: {
//     component: 'switch',
//   },

//   bio: {
//     component: 'textarea',
//   },

//   marshmallows: {
//     label: 'How many marshmallows fit in your mouth?',
//     component: 'radio',
//   },

//   file: {
//     label: 'Text file',
//     component: 'file',
//   },
// }
