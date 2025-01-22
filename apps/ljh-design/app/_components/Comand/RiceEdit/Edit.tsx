'use client';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  FaBold,
  FaItalic,
  FaList,
  FaListOl,
  FaListUl,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from 'react-icons/fa';
import './tiptap.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { UseFormSetError, UseFormSetValue } from 'react-hook-form';
import TiptapToolbar from './TiptapToolbar';

const Tiptap = ({
  content = '',
  setValue,
  editorab = true,
  setError,
}: {
  content: string;
  setValue: UseFormSetValue<{
    explanation: string;
    title: string;
    relativeTheme: string;
    tap?: string[];
  }>;
  editorab?: boolean;
  setError: UseFormSetError<{
    explanation: string;
    title: string;
    tap?: string[];
    relativeTheme: string;
  }>;
}) => {
  const { theme } = useTheme();
  const [editor, setEditor] = useState<Editor | null>(null);
  // @ts-ignore
  useEffect(() => {
    let activeTheme = theme;
    if (theme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
    }
    const editor = new Editor({
      editorProps: {
        attributes: {
          class: activeTheme === 'dark' ? 'tiptap dark' : 'tiptap light',
        },
      },
      onUpdate: ({ editor }) => {
        if (!editor.getText()) return setError('explanation', { message: '不能为空' });
        setValue('explanation', editor.getHTML());
      },
      extensions: [
        StarterKit,
        Underline,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),

        Placeholder.configure({ placeholder: '请输入内容' }),
      ],
      editable: editorab,
      content: content,
    });
    setEditor(editor);
  }, [theme]);

  const tiptapToolBar = [
    {
      title: '加粗',
      key: 'bold',
      icon: <FaBold />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold') || false,
      disabled: true,
    },
    {
      title: '斜体',
      key: 'italic',
      icon: <FaItalic />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic') || false,
      disabled: true,
    },
    {
      title: '下划线',
      key: 'underline',
      icon: <FaUnderline />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: editor?.isActive('underline') || false,
      disabled: true,
    },
    {
      title: '删除线',
      key: 'strike',
      icon: <FaStrikethrough />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike') || false,
      disabled: true,
    },
    {
      key: 'list',
      title: '无序列表',
      icon: <FaListUl />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('list') || false,
      disabled: true,
    },
    {
      key: 'ordered-list',
      title: '有序列表',
      icon: <FaListOl />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('ordered-list') || false,
      disabled: true,
    },
    {
      key: 'undo',
      title: '撤销',
      icon: <FaUndo />,
      onClick: () => editor?.chain().focus().undo().run(),
      active: editor?.isActive('undo') || false,
      disabled: editor?.can().undo() || false,
    },
    {
      key: 'redo',
      title: '重做',
      icon: <FaRedo />,
      onClick: () => editor?.chain().focus().redo().run(),
      active: editor?.isActive('redo') || false,
      disabled: editor?.can().redo() || false,
    },
    {
      key: 'task-list',
      title: '任务列表',
      icon: <FaList />,
      onClick: () => editor?.chain().focus().toggleTaskList().run(),
      active: editor?.isActive('taskList') || false,
      disabled: true,
    },
  ];
  return (
    <section className="h-full w-full">
      <main className="h-8">{editor && <TiptapToolbar tiptapToolBar={tiptapToolBar} />}</main>
      <ScrollArea className="h-full w-full">
        {/* tiptap实例 */}
        <EditorContent className="h-full" placeholder="请输入内容" editor={editor} />
      </ScrollArea>
    </section>
  );
};

export default Tiptap;
