import { z } from 'zod'
import type {
  BigText,
  CreateFormItem,
  DatePicker,
  FormInput,
  Radio,
  Select,
  Slider,
} from '@/types/form'
import { Ref } from 'vue'
import { Files } from '@/types/form'

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

//////////////////////////////////////// 下面是/😊😊
//////////////////////////////////////// 基本类型😊😊

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
    console.log(schema.defaultValue)
    // 默认值
    if (schema.defaultValue) {
      zodSchema = zodSchema.default(schema.defaultValue)
      obj.inputProps.defaultValue = schema.defaultValue
    }
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
 * ###  zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * ## 日期选择器
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 */
export const dateZod = (schema: DatePicker, fieldConfig: Ref<Record<string, any>>) => {
  let obj: Record<string, any> = {
    inputProps: {},
  }
  let zodSchema
  zodSchema = z.coerce.date()
  if (schema.description && !schema.hiddenLabel) {
    zodSchema = hasDescription(zodSchema, schema.description)
  } else {
    obj.hideLabel = true
  }

  obj.inputProps.description = 'description'
  // 非必填
  if (!schema.isRequired) zodSchema = zodSchema.optional()
  // 默认值
  // if (schema.defaultValue) {
  //   zodSchema = zodSchema.default(new Date(schema.defaultValue as string).toISOString())
  //   obj.inputProps.defaultValue = schema.defaultValue
  // }
  // 占位符
  obj = genAutoFormPlaceHolder(obj, schema.placeholder)
  // 检查inputProps是否存在
  obj = checkInputProps(obj)
  console.log(obj)
  fieldConfig.value = { ...fieldConfig.value, [schema.defaultTypeName]: obj }
  return zodSchema
}

/** 
  
* ### 大文本
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 */
export const bigTextZod = (schema: BigText, fieldConfig: Ref<Record<string, any>>) => {
  let obj: Record<string, any> = {
    inputProps: {},
    component: 'textarea',
  }
  let zodSchema
  zodSchema = z.string()
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
  // 占位符
  obj = genAutoFormPlaceHolder(obj, schema.placeholder)
  // 检查inputProps是否存在
  obj = checkInputProps(obj)
  // 生成autoForm的配置
  fieldConfig.value = { ...fieldConfig.value, [schema.defaultTypeName]: obj }
  return zodSchema
}

/**
 * ## 滑动按钮
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 */
export const sliderZod = (schema: Slider, fieldConfig: Ref<Record<string, any>>): z.ZodType => {
  let obj: Record<string, any> = {
    inputProps: {},
    component: 'switch',
  }
  let zodSchema
  zodSchema = z.boolean()
  // 必填
  if (schema.isRequired)
    zodSchema = zodSchema.refine((value) => value, {
      message: '必填',
      path: [schema.defaultTypeName],
    })
  // 标签
  if (schema.description && !schema.hiddenLabel)
    zodSchema = hasDescription(zodSchema, schema.description)
  else obj.hideLabel = true
  // 默认值
  zodSchema = zodSchema.default(Boolean(schema.defaultValue))
  // 非必填
  if (!schema.isRequired) zodSchema = zodSchema.optional()
  // 占位符
  obj = genAutoFormPlaceHolder(obj, schema.placeholder)
  // 检查inputProps是否存在
  obj = checkInputProps(obj)
  // 生成autoForm的配置
  fieldConfig.value = { ...fieldConfig.value, [schema.defaultTypeName]: obj }
  return zodSchema
}

/**
 * ###  zod的顺序说明 先用string和number等基础类型---required（min）必填---description标签---default默认---!required（optional）非必填
 * ## 下拉框的
 * @param schema 数据
 * @returns zod
 */
export const radioZod = (schema: Radio, fieldConfig: Ref<Record<string, any>>) => {
  let obj: Record<string, any> = {
    inputProps: {},
    component: 'radio',
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
 * 文件
 * @param schema 数据
 * @param fieldConfig<Ref<Record<string, any>>>  配置
 * @returns zod校验
 */
export const fileZod = (schema: Files, fieldConfig: Ref<Record<string, any>>) => {
  let obj: Record<string, any> = {
    inputProps: {},
    component: 'file',
  }
  let zodSchema
  zodSchema = z.string()
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
  // 文件
  if (schema.type === 'file') {
    const zodSchema = fileZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 单选框
  if (schema.type === 'radio') {
    const zodSchema = radioZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 下拉框
  if (schema.type === 'select') {
    const zodSchema = selectZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 日期
  if (schema.type === 'date') {
    const zodSchema = dateZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 大文本
  if (schema.type === 'bigText') {
    const zodSchema = bigTextZod(schema, fieldConfig)
    return z.object({ [schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  // 滑动按钮
  if (schema.type === 'slider') {
    const zodSchema = sliderZod(schema, fieldConfig)
    return z.object({ [schema.description || schema.defaultTypeName]: zodSchema as z.ZodType })
  }
  return null
}

/**
 * 获取fieldConfig
 * @returns fieldConfig
 */
export function getFieldConfig(schema: CreateFormItem, zod: z.ZodType) {
  return {}
}
