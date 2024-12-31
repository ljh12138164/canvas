import { z } from 'zod'
import type { CreateFormItem, FormInput, Select } from '@/types/form'
import { Ref } from 'vue'

/**
 * ### zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * ### 检查inputProps是否存在
 * @param obj<Ref<Record<string, any>>>  生成autoForm的配置
 * @returns zod校验
 */
export const checkInputProps = (obj: Record<string | 'inputProps', any>) => {
  if (!Object.keys(obj.inputProps).length) delete obj.inputProps
  return obj
}

/**
 * ### zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * @param obj<Ref<Record<string, any>>>  生成autoForm的配置
 * @param placeholder 占位符
 * @param schema zod校验
 * @returns zod校验
 */
export const genAutoFormPlaceHolder = (
  obj: Record<string | 'inputProps', any>,
  placeholder: string,
) => {
  if (placeholder) obj.inputProps.placeholder = placeholder
  return obj
}

/**
 * ### zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * ### 是否有描述（其实是修改标签）
 * @param
 */
export const hasDescription = (schema: z.ZodType, value: string) => {
  if (value) return schema.describe(value)
  return schema
}

z.string().min(2).default('123').describe('123').optional()
/**
 * ###  zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * ## 下拉框的
 * @param schema 数据
 * @returns zod
 */
export const selectZod = (schema: Select, fieldConfig: Ref<Record<string, any>>) => {
  let obj: Record<string, any> = {
    inputProps: {},
  }
  let zodSchema
  zodSchema = z.enum(schema.options.map((item) => item.name) as [string, ...string[]])
  if (schema.description && !schema.hiddenLabel) {
    zodSchema = hasDescription(zodSchema, schema.description)
  } else {
    obj.hideLabel = true
  }

  // 非必填
  if (!schema.isRequired) zodSchema = zodSchema.optional()
  // 占位符
  obj = genAutoFormPlaceHolder(obj, schema.placeholder)
  // 检查inputProps是否存在
  obj = checkInputProps(obj)
  fieldConfig.value = { ...fieldConfig.value, [schema.defaultTypeName]: obj }
  return zodSchema
}
/**
 * ###  zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
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
    // 必填
    if (schema.isRequired) zodSchema = zodSchema.min(1, { message: '必填' })
    // 标签
    if (schema.description && !schema.hiddenLabel)
      zodSchema = hasDescription(zodSchema, schema.description)
    else obj.hideLabel = true

    // 默认值
    zodSchema = zodSchema.default(String(schema.defaultValue))
    // 非必填
    if (!schema.isRequired) zodSchema = zodSchema.optional()
  }
  // 数字
  if (schema.inputType === 'number') {
    zodSchema = z.number()
    obj.type = 'number'
    // 必填
    if (schema.isRequired) zodSchema = zodSchema.min(0, { message: '必填' })
    // 标签
    if (schema.description && !schema.hiddenLabel)
      zodSchema = hasDescription(zodSchema, schema.description)
    else obj.hideLabel = true
    // 默认值
    zodSchema = zodSchema.default(
      Number.isNaN(Number(schema.defaultValue)) ? 0 : Number(schema.defaultValue),
    )
    // 非必填
    if (!schema.isRequired) zodSchema = zodSchema.optional()
  }
  // 占位符
  obj = genAutoFormPlaceHolder(obj, schema.placeholder)
  // 检查inputProps是否存在
  obj = checkInputProps(obj)

  // 生成autoForm的配置
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
  if (schema.type === 'select') {
    const zodSchema = selectZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
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
