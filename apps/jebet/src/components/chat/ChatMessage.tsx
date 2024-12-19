import styled from 'styled-components';
import UserButtons from '../command/UserButtons';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
const UserButtonsContainer = styled.div``;

const ChatMessage = () => {
  new Editor({
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
    <>
      <UserButtonsContainer>
        <UserButtons />
      </UserButtonsContainer>
      <div></div>
    </>
  );
};

export default ChatMessage;
