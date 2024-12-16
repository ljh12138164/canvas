// src/Tiptap.tsx
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './tiptap.css';
import Placeholder from '@tiptap/extension-placeholder';
import { ScrollArea } from '../ui/scrollArea';
import { useTheme } from '../ui/theme-provider';
// define your extension array

const content = '<p>Hello World!</p>';

const Tiptap = () => {
  const { theme } = useTheme();
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: theme === 'dark' ? 'tiptap dark' : 'tiptap light',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: '请输入内容' }),
    ],
    content,
  });

  return (
    <section className='h-full w-full'>
      <ScrollArea className='h-full w-full '>
        <EditorContent
          className='h-full'
          placeholder='请输入内容'
          editor={editor}
        />
      </ScrollArea>
      <FloatingMenu editor={editor} tippyOptions={{ placement: 'bottom' }}>
        浮动菜单
      </FloatingMenu>
      <BubbleMenu editor={editor} tippyOptions={{ placement: 'bottom' }}>
        气泡菜单
      </BubbleMenu>
    </section>
  );
};

export default Tiptap;
