import ListItem from '@tiptap/extension-list-item';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './chatMessage.scss';
import Underline from '@tiptap/extension-underline';
import UserButtons from '../command/UserButtons';
import styled from 'styled-components';

const UserButtonsContainer = styled.div``;
const MessageContainer = styled.div`
  display: flex;
  width: 100%;
`;
const ChatMessageList = () => {
  const editor = new Editor({
    editorProps: {
      attributes: {
        class: 'tiptaps',
      },
    },
    content: `<p>Example Text</p>`,
    editable: false,
    extensions: [StarterKit, ListItem, Underline],
  });
  return (
    <MessageContainer>
      <UserButtonsContainer>
        <UserButtons />
      </UserButtonsContainer>
      <EditorContent editor={editor} />
    </MessageContainer>
  );
};

export default ChatMessageList;
