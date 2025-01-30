import { nanoid } from 'nanoid';

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
  | 'custom';
//下拉的默认值
export const selectDefaultValue = [
  {
    name: '选项一',
    id: nanoid(),
  },
  {
    name: '选项二',
    id: nanoid(),
  },
  {
    name: '选项三',
    id: nanoid(),
  },
];
// 可clone的表单项
export const formItemList = [
  {
    // 拖拽的名称
    name: '输入框',
    inputType: 'text',
    // 表单的名称用于默认名字
    defaultTypeName: '输入框',
    label: '输入框',
    id: '1',
    type: 'input',
    hiddenLabel: false,
    description: '',
    isRequired: false,
    placeholder: '请输入',
    defaultValue: '',
  },
  {
    name: '单选框',
    id: '2',
    type: 'radio',
    defaultTypeName: '单选框',
    hiddenLabel: false,
    label: '单选框',
    isRequired: false,
    description: '',
    placeholder: '请选择',
    defaultValue: '',
    options: selectDefaultValue,
  },
  {
    name: '文件',
    id: '3',
    type: 'file',
    defaultTypeName: '文件',
    hiddenLabel: false,
    label: '文件',
    isRequired: false,
    description: '',
    placeholder: '请选择文件',
    defaultValue: '',
  },
  {
    name: '下拉框',
    id: '4',
    type: 'select',
    defaultTypeName: '下拉框',
    hiddenLabel: false,
    label: '下拉框',
    isRequired: false,
    description: '',
    placeholder: '请选择',
    defaultValue: '',
    options: selectDefaultValue,
  },
  {
    name: '日期选择器',
    id: '5',
    type: 'date',
    defaultTypeName: '日期选择器',
    hiddenLabel: false,
    label: '日期选择器',
    isRequired: false,
    description: '',
    placeholder: '请选择',
    defaultValue: '',
  },
  {
    name: '大文本',
    id: '6',
    type: 'bigText',
    defaultTypeName: '大文本',
    hiddenLabel: false,
    label: '大文本',
    isRequired: false,
    description: '',
    placeholder: '请输入',
    defaultValue: '',
  },
  {
    name: '滑动按钮',
    id: '7',
    type: 'slider',
    defaultTypeName: '滑动按钮',
    hiddenLabel: false,
    label: '滑动按钮',
    isRequired: false,
    description: '',
    placeholder: '请输入',
    defaultValue: '',
  },
  {
    name: '子表单',
    id: '8',
    type: 'obj',
    defaultTypeName: '子表单',
    hiddenLabel: false,
    label: '子表单',
    isRequired: false,
    description: '',
    placeholder: '请输入',
    defaultValue: '',
    children: [],
  },
];

// 可更改表单项
export type FormType =
  | 'name'
  | 'type'
  | 'label'
  | 'isRequired'
  | 'placeholder'
  | 'defaultValue'
  | 'description'
  | 'hiddenLabel'
  | 'inputType'
  | 'options'
  | 'defaultTypeName';

// 基础表单项
export interface FormItem {
  id: string;
  name: string;
  label: string;
  description: string;
  // default: z.ZodType<any>
  isRequired: boolean;
  hiddenLabel: boolean;
  placeholder: string;
  defaultValue: string | number | boolean;
}

// 表单输入项
export interface FormInput extends FormItem {
  inputType: 'text' | 'number';
  defaultTypeName: '输入框';
  type: 'input';
}

// 表单项
export interface Files extends FormItem {
  type: 'file';
  defaultTypeName: '文件';
}
//
export interface Radio extends FormItem {
  type: 'radio';
  defaultTypeName: '单选框';
  options: { name: string; id: string }[];
}
export interface Select extends FormItem {
  type: 'select';
  defaultTypeName: '下拉框';
  options: { name: string; id: string }[];
}
export interface DatePicker extends FormItem {
  type: 'date';
  defaultTypeName: '日期选择器';
}
export interface BigText extends FormItem {
  type: 'bigText';
  defaultTypeName: '大文本';
}
export interface Slider extends FormItem {
  type: 'slider';
  defaultTypeName: '滑动按钮';
}
export interface ObjectItem extends FormItem {
  type: 'obj';
  defaultTypeName: '子表单';
  children: CreateFormItem[];
}
// 表单项
export type CreateFormItem =
  | FormInput
  | Files
  | Radio
  | Select
  | DatePicker
  | BigText
  | Slider
  | ObjectItem;

// 提交的表单项
export interface SubmitFormItem {
  // 可能是数字 字符串 布尔值 数组 对象 或文件
  SubmitValue: any;
  // 提交的类型
  type: CreateFormItem['type'];
  name: string;
  // 标签
  label: string;
  // 选项
  options?: { name: string; id: string }[];
  // 隐藏标签
  hiddenLabel: boolean;
}

export interface FileType extends SubmitFormItem {
  //----文件才有的----
  // 文件
  file?: string;
  // 文件类型
  inputType?: string;
  // 文件全类型
  fullType?: string;
  // 文件类型
  fileType?: string;
}
