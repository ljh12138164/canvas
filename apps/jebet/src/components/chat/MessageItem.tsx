import type { ChatMessage } from '@/types/chat';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTheme } from '../ui/theme-provider';
import './chatMessage.scss';
import styled from 'styled-components';

interface MessageItemProps {
  message: ChatMessage;
}
const MessageItemContainer = styled.div`
  width: 100%;
`;
const MessageItem = ({ message }: MessageItemProps) => {
  const { theme } = useTheme();
  const editor = new Editor({
    editorProps: {
      attributes: {
        class: theme === 'dark' ? 'tiptaps  dark' : 'tiptaps light',
      },
    },
    editable: false,
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({ placeholder: '请输入内容' }),
    ],
    content: message.message,
  });
  return (
    <MessageItemContainer>
      <EditorContent editor={editor} />
    </MessageItemContainer>
  );
};

export default MessageItem;
