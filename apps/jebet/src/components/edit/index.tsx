import { useCreateMessage } from '@/server/hooks/chat.js';
import type { Member, Workspace } from '@/types/workspace.js';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';
import styled from 'styled-components';
import { ScrollArea } from '../ui/scrollArea';
import { useTheme } from '../ui/theme-provider';
import suggestion from './suggest.js';
import './tiptap.scss';
import TiptapToolbar from './TiptapToolbar';
const TiptapToolbarContainer = styled.div`
  height: 2rem;
  display: flex;
  border: 2px solid #e0e0e0;
`;

interface TiptapProps {
  workspace: Workspace & { member: Member[] };
}
const Tiptap = ({ workspace }: TiptapProps) => {
  const { theme } = useTheme();
  const { messagePending } = useCreateMessage(workspace.id);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: theme === 'dark' ? 'tiptap dark' : 'tiptap light',
      },
    },
    editable: !messagePending,
    onUpdate: ({ editor }) => {
      localStorage.setItem(workspace.id, JSON.stringify(editor.getHTML()));
    },
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: suggestion(workspace.member.map((item) => item.username)),
      }),
      Placeholder.configure({ placeholder: '请输入内容' }),
    ],
    content: JSON.parse(localStorage.getItem(workspace.id) || '{}'),
  });

  const tiptapToolBar = [
    {
      title: '加粗',
      key: 'bold',
      icon: <BoldIcon />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: editor?.isActive('bold') || false,
      disabled: true,
    },
    {
      title: '斜体',
      key: 'italic',
      icon: <ItalicIcon />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: editor?.isActive('italic') || false,
      disabled: true,
    },
    {
      title: '下划线',
      key: 'underline',
      icon: <UnderlineIcon />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: editor?.isActive('underline') || false,
      disabled: true,
    },
    {
      title: '删除线',
      key: 'strike',
      icon: <StrikethroughIcon />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: editor?.isActive('strike') || false,
      disabled: true,
    },
    {
      key: 'list',
      title: '无序列表',
      icon: <ListIcon />,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: editor?.isActive('list') || false,
      disabled: true,
    },
    {
      key: 'ordered-list',
      title: '有序列表',
      icon: <ListOrderedIcon />,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: editor?.isActive('ordered-list') || false,
      disabled: true,
    },
    {
      key: 'undo',
      title: '撤销',
      icon: <UndoIcon />,
      onClick: () => editor?.chain().focus().undo().run(),
      active: editor?.isActive('undo') || false,
      disabled: editor?.can().undo() || false,
    },
    {
      key: 'redo',
      title: '重做',
      icon: <RedoIcon />,
      onClick: () => editor?.chain().focus().redo().run(),
      active: editor?.isActive('redo') || false,
      disabled: editor?.can().redo() || false,
    },
    {
      key: 'task-list',
      title: '任务列表',
      icon: <ListTodoIcon />,
      onClick: () => editor?.chain().focus().toggleTaskList().run(),
      active: editor?.isActive('taskList') || false,
      disabled: true,
    },
  ];
  return (
    <section className="h-full w-full">
      <TiptapToolbarContainer>
        {editor && (
          <TiptapToolbar tiptapToolBar={tiptapToolBar} editor={editor} workspace={workspace} />
        )}
      </TiptapToolbarContainer>
      <ScrollArea className="h-full w-full">
        {/* tiptap实例 */}
        <EditorContent className="h-full" placeholder="请输入内容" editor={editor} />
      </ScrollArea>
    </section>
  );
};

export default Tiptap;
