import Quill from 'quill';
import type { QuillOptions } from 'quill';
import { useEffect, useRef } from 'react';
import './quil.css';
import 'quill/dist/quill.snow.css';

const ReactQuillEditor = () => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!quillRef.current) return;
    const container = quillRef.current;
    // 创建一个div元素，用于放置富文本编辑器
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));
    const options: QuillOptions = {
      theme: 'snow',
    };
    new Quill(editorContainer, options);
    return () => {
      // 销毁富文本编辑器
      if (container) container.innerHTML = '';
    };
  }, []);
  return (
    <div className="react-quill-wrap">
      <h2 className="title">评论</h2>
      <div className="quill-editor-wrap" id="quill-editor-wrap" ref={quillRef} />
    </div>
  );
};

export default ReactQuillEditor;
