import { Config } from '@/components/ui/auto-form'
import { CreateFormItem, FormItem } from '@/types/form'
import type { Updater } from '@tanstack/vue-query'
import { type ClassValue, clsx } from 'clsx'
import localforage from 'localforage'
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
 * 生成zod校验
 * @param schema 数据
 * @returns 数据
 */
// const schema = z.object({
//   username: z.string().min(2),
// })
export function getZodSchema(schema: CreateFormItem, fieldConfig: Ref<Record<string, any>>) {
  let zodSchema
  let obj = {}
  if (schema.type === 'input') {
    if (schema.inputType === 'text') {
      zodSchema = z.string({ [schema.id]: z.string() })
      obj = { ...obj, type: 'text' }
      if (schema.defaultValue) zodSchema = zodSchema.default(String(schema.defaultValue))
    }
    if (schema.inputType === 'number') {
      zodSchema = z.number({ [schema.id]: z.number() })
      obj = { ...obj, type: 'number' }
      if (schema.defaultValue)
        zodSchema = zodSchema.default(isNaN(+schema.defaultValue) ? 0 : +schema.defaultValue)
    }
    if (!schema.isRequired) zodSchema = zodSchema?.optional()
    if (schema.label) obj = { ...obj, label: schema.label }
    fieldConfig.value = { ...fieldConfig.value, [schema.id]: obj }
    //   password: {
    //     label: 'Your secure password',
    //     inputProps: {
    //       type: 'password',
    //       placeholder: '••••••••',
    //     },
    //   },
    return z.object({ [schema.id]: zodSchema as z.ZodType })
  }
  if (schema.type === 'checkbox') return z.object({ [schema.id]: z.boolean() })
  if (schema.type === 'radio') return z.object({ [schema.id]: z.string() })
  // if (schema.type === 'select') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'textarea') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'date') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'time') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'datetime') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'datetime-local') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'email') return z.string({ [schema.id]: z.string() })
  // if (schema.type === 'number') return z.string({ [schema.id]: z.number() })
  return undefined
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
