import type { z } from 'zod'

export interface FormItem {
  id: string
  name: string
  type: string
  // default?: z.ZodType<any>
  isRequired?: boolean
  placeholder?: string
  defaultValue?: string
}

export type FormSubmit =
  | 'required'
  | 'min'
  | 'max'
  | 'min_length'
  | 'max_length'
  | 'email'
  | 'url'
  | 'uuid'
  | 'date'
  | 'datetime'
  | 'time'
  | 'number'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'array'
  | 'object'
  | 'enum'
  | 'regex'
  | 'custom'
