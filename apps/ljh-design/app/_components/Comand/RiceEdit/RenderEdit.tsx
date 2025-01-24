import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// 渲染富文本和
export function RenderEditor({ content }: { content: string }) {
  const editor = new Editor({
    content,
    editable: false,
    extensions: [StarterKit],
  });
  return <div className="p-5">{content && <EditorContent editor={editor} />}</div>;
}
