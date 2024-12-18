import { Member, Workspace } from '@/types/workspace.js';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styled from 'styled-components';
import { ScrollArea } from '../ui/scrollArea';
import { useTheme } from '../ui/theme-provider';
import suggestion from './suggest.js';
import './tiptap.scss';
import TiptapToolbar from './TiptapToolbar';
// define your extension array
const TiptapToolbarContainer = styled.div`
  height: 2rem;
  display: flex;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
`;

interface TiptapProps {
  workspace: Workspace & { member: Member[] };
}
const Tiptap = ({ workspace }: TiptapProps) => {
  const { theme } = useTheme();

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: theme === 'dark' ? 'tiptap dark' : 'tiptap light',
      },
    },
    onUpdate: ({ editor }) => {
      localStorage.setItem(workspace.id, JSON.stringify(editor.getHTML()));
    },
    extensions: [
      StarterKit,
      Underline,
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
  return (
    <section className='h-full w-full'>
      <TiptapToolbarContainer>
        {editor && <TiptapToolbar editor={editor} />}
      </TiptapToolbarContainer>
      <ScrollArea className='h-full w-full '>
        {/* tiptap实例 */}
        <EditorContent
          className='h-full'
          placeholder='请输入内容'
          editor={editor}
        />
      </ScrollArea>
    </section>
  );
};

export default Tiptap;
