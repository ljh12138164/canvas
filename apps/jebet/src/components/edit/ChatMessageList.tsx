import ListItem from '@tiptap/extension-list-item';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './chatMessage.scss';
import Underline from '@tiptap/extension-underline';

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
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default ChatMessageList;
