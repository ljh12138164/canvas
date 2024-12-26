export type Type =
  | 'input'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'textarea'
  | 'select'
  | 'date'
  | 'time'
  | 'datetime'
  | 'datetime-local'
  | 'number'
  | 'email'
  | 'url'
  | 'password'
  | 'file'
  | 'array'
  | 'object'
  | 'enum'
  | 'regex'
  | 'custom'
// 基础表单项
export interface FormItem {
  id: string
  name: string
  label: string
  // default: z.ZodType<any>
  isRequired: boolean
  placeholder: string
  defaultValue: string | number | boolean
}

// 表单输入项
export interface FormInput extends FormItem {
  inputType: 'text' | 'number'
  type: 'input'
}

// 表单项
export interface Checkbox extends FormItem {
  type: 'checkbox'
}
//
export interface Radio extends FormItem {
  type: 'radio'
}
export interface Select extends FormItem {
  type: 'select'
}
// 表单项
export type CreateFormItem = FormInput | Checkbox | Radio | Select
