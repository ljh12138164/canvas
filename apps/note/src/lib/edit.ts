import type { Editor } from '@tiptap/vue-3';

// tiptap支持的字体
export const fontFamily = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Serif', value: 'serif' },
  { label: 'Cursive', value: 'cursive' },
  {
    label: 'Georgia',
    value: 'Georgia',
  },
  {
    label: 'Verdana',
    value: 'Verdana',
  },
  {
    label: 'unset',
    value: '',
  },
];
// 字体标题
export const fontTitle = [
  { label: '默认', value: 0, fontSize: '12px' },
  { label: '1级标题', value: 1, fontSize: '20px' },
  { label: '2级标题', value: 2, fontSize: '18px' },
  { label: '3级标题', value: 3, fontSize: '16px' },
  { label: '4级标题', value: 4, fontSize: '14px' },
  { label: '5级标题', value: 5, fontSize: '12px' },
];

export const align = [
  { label: '左对齐', value: 'left', iconName: 'mdi:format-align-left' },
  { label: '居中', value: 'center', iconName: 'mdi:format-align-center' },
  { label: '右对齐', value: 'right', iconName: 'mdi:format-align-right' },
];

export const list = [
  {
    label: '无序列表',
    value: 'bulletList',
    iconName: 'mdi:format-list-bulleted',
    onClick: (editor: Editor) => {
      editor?.chain().focus().toggleBulletList().run();
    },
  },
  {
    label: '有序列表',
    value: 'orderedList',
    iconName: 'mdi:format-list-numbered',
    onClick: (editor: Editor) => {
      editor?.chain().focus().toggleOrderedList().run();
    },
  },
];

export const LineHeightExtension = [
  { label: '默认', value: 'normal' },
  { label: '单倍', value: '1' },
  { label: '1.2', value: '1.2' },
  { label: '1.5', value: '1.5' },
  { label: '双倍', value: '2' },
];

export const fontSizeExtension = [
  { label: '10px', value: '10px' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '40px', value: '40px' },
  { label: '48px', value: '48px' },
  { label: '56px', value: '56px' },
  { label: '64px', value: '64px' },
  { label: '72px', value: '72px' },
  { label: '80px', value: '80px' },
];
