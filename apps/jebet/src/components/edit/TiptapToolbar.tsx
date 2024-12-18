import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';
import TiptapButton from './TiptapButton';
import { Button } from '../ui/button';
import styled from 'styled-components';
interface TiptapToolbar {
  editor: Editor;
}
const SubmitButton = styled(Button)`
  border-radius: 0;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
const TiptapToolbar = ({ editor }: TiptapToolbar) => {
  const tiptapToolBar = [
    {
      key: 'bold',
      icon: <BoldIcon />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
      disabled: true,
    },
    {
      key: 'italic',
      icon: <ItalicIcon />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
      disabled: true,
    },
    {
      key: 'underline',
      icon: <UnderlineIcon />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive('underline'),
      disabled: true,
    },
    {
      key: 'strike',
      icon: <StrikethroughIcon />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive('strike'),
      disabled: true,
    },
    {
      key: 'list',
      icon: <ListIcon />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('list'),
      disabled: true,
    },
    {
      key: 'ordered-list',
      icon: <ListOrderedIcon />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('ordered-list'),
      disabled: true,
    },
    {
      key: 'undo',
      icon: <UndoIcon />,
      onClick: () => editor.chain().focus().undo().run(),
      active: editor.isActive('undo'),
      disabled: editor.can().undo(),
    },
    {
      key: 'redo',
      icon: <RedoIcon />,
      onClick: () => editor.chain().focus().redo().run(),
      active: editor.isActive('redo'),
      disabled: editor.can().redo(),
    },
  ];
  return (
    <>
      {tiptapToolBar.map((item) => (
        <TiptapButton {...item} />
      ))}
      <SubmitButton
        variant='outline'
        className='rounded-none'
        onClick={() => {
          //TODO: 发送消息
        }}
      >
        发送
      </SubmitButton>
    </>
  );
};

export default TiptapToolbar;
