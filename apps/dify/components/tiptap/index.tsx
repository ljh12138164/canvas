'use client';
// src/Tiptap.tsx
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TableCell } from '@tiptap/extension-table/cell';
import { TableHeader } from '@tiptap/extension-table/header';
import { TableRow } from '@tiptap/extension-table/row';
import { Table } from '@tiptap/extension-table/table';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Dropcursor } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import juice from 'juice';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Textarea } from '../ui';
import { Button } from '../ui/button';

// --- 保留原有的自定义属性逻辑 ---
const ADD_ALL_ATTRS = {
  addAttributes() {
    return {
      attrs: {
        default: {},
        parseHTML: (element: HTMLElement) => {
          const attrs: Record<string, string> = {};
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },
        renderHTML: (attributes: { attrs: Record<string, string> }) => {
          return attributes.attrs || {};
        },
      },
    };
  },
};

const extensions = [
  Dropcursor,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Document,
  Subscript.extend(ADD_ALL_ATTRS),
  Blockquote.extend(ADD_ALL_ATTRS),
  HorizontalRule.extend(ADD_ALL_ATTRS),
  Paragraph.extend({
    ...ADD_ALL_ATTRS,
    parseHTML() {
      return [{ tag: 'p' }, { tag: 'div' }];
    },
  }),
  Strike.extend(ADD_ALL_ATTRS),
  OrderedList.extend(ADD_ALL_ATTRS),
  Italic.extend(ADD_ALL_ATTRS),
  Underline.extend(ADD_ALL_ATTRS),
  TextStyleKit.extend(ADD_ALL_ATTRS),
  Image.extend(ADD_ALL_ATTRS),
  Superscript.extend(ADD_ALL_ATTRS),
  Heading.extend(ADD_ALL_ATTRS).configure({ levels: [1, 2, 3, 4, 5, 6] }),
  Link.extend({ ...ADD_ALL_ATTRS }).configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https'],
  }),
  Highlight.extend(ADD_ALL_ATTRS).configure({ multicolor: true }),
  Code.extend(ADD_ALL_ATTRS),
  Bold.extend(ADD_ALL_ATTRS),
  Text,
  CodeBlock.extend(ADD_ALL_ATTRS),
  BulletList.extend(ADD_ALL_ATTRS),
  ListItem.extend(ADD_ALL_ATTRS),
  Table.extend(ADD_ALL_ATTRS),
  TableRow.extend(ADD_ALL_ATTRS),
  TableHeader.extend(ADD_ALL_ATTRS),
  TableCell.extend(ADD_ALL_ATTRS),
];

// --- 组件 Props 定义 ---
export interface TiptapProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const Tiptap: React.FC<TiptapProps> = ({ value, defaultValue, onChange }) => {
  // 1. 使用 rc-util 的 useMergedState 支持受控/非受控模式
  const [mergedValue, setMergedValue] = useMergedState(defaultValue || '', {
    value,
    onChange,
    postState: (val) => juice(val || ''), // 传入的 value 用 juice 转化
  });

  // 2. 弹窗状态管理
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [tempHtmlContent, setTempHtmlContent] = useState('');

  // 3. 初始化编辑器
  const editor = useEditor({
    // @ts-ignore
    extensions,
    content: mergedValue,
    immediatelyRender: false,

    onCreate({ editor }) {
      const html = editor.getHTML();
      setMergedValue(html);
    },
    onUpdate: ({ editor }) => {
      // 当编辑器内容改变时，更新 state 并触发 onChange
      const html = editor.getHTML();
      setMergedValue(html);
    },
  });

  // 4. 监听外部 value 变化并同步到 Tiptap (防止光标跳动)
  useEffect(() => {
    if (editor && mergedValue !== editor.getHTML()) {
      // 避免重复更新导致光标位置丢失
      editor.commands.setContent(mergedValue);
    }
  }, [mergedValue, editor]);

  // 5. 弹窗保存逻辑
  const handleSaveHtml = useCallback(() => {
    const juicedHtml = juice(tempHtmlContent); // 弹窗的内容用 juice 转化
    setMergedValue(juicedHtml);
    if (editor) {
      editor.commands.setContent(juicedHtml);
    }
    setIsHtmlModalOpen(false);
  }, [tempHtmlContent, setMergedValue, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 编辑器内容区 */}
      <div style={{ padding: '12px', flex: 1, overflow: 'auto' }}>
        <EditorContent editor={editor} />
      </div>

      {/* HTML 编辑弹窗 */}
      <Dialog open={isHtmlModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑源码 (HTML)</DialogTitle>
          </DialogHeader>
          <Textarea
            value={tempHtmlContent}
            onChange={(e) => setTempHtmlContent(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              fontFamily: 'monospace',
              padding: '8px',
              resize: 'vertical',
            }}
          />
          <DialogFooter>
            <Button onClick={() => setIsHtmlModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveHtml}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tiptap;
