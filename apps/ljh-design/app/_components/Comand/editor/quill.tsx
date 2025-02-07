'use client';
import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import Quill from 'quill';
import type { QuillOptions } from 'quill';
import { useEffect, useRef, useState } from 'react';
import './quil.css';
import 'quill/dist/quill.snow.css';
import { useAnswer, useGetAnswer } from '@/app/_hook/query/useAnswer';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Skeleton } from '../../ui/skeleton';
import Render from './render';

const ReactQuillEditor = ({ showData }: { showData: GetShowResponseType }) => {
  const { mutate, isPending } = useAnswer();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAnswer(showData.id);
  const quillRef = useRef<HTMLDivElement | null>(null);
  const [quillContent, setQuillContent] = useState('');
  // 展示富文本编辑器
  useEffect(() => {
    if (!quillRef.current) return;
    const container = quillRef.current;
    // 创建一个div元素，用于放置富文本编辑器
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));
    const options: QuillOptions = {
      theme: 'snow',
    };
    const quill = new Quill(editorContainer, options);
    quill.on('text-change', () => {
      setQuillContent(quill.root.innerHTML);
    });
    return () => {
      // 销毁富文本编辑器
      if (container) container.innerHTML = '';
    };
  }, []);

  const handelSubmit = () => {
    if (!quillContent) {
      toast.dismiss();
      toast.error('请输入评论内容');
      return;
    }
    toast.loading('评论中...');
    mutate(
      {
        json: {
          content: quillContent,
          id: showData.id,
        },
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success('评论成功');
          queryClient.invalidateQueries({ queryKey: ['answers', showData.id] });
        },
      },
    );
  };
  return (
    <>
      <section className="react-quill-wrap">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-bold my-2">评论 </h2>
          <Button type="button" className="h-8" onClick={handelSubmit} disabled={isPending}>
            发布
          </Button>
        </header>
        <div className="quill-editor-wrap" id="quill-editor-wrap" ref={quillRef} />
        <h2 className="text-xl font-bold my-2">全部评论</h2>
        <Separator className="my-2" />
        {data?.length === 0 && <p className="text-center text-gray-500">暂无评论</p>}
        <section className="flex flex-col gap-2">
          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            data?.map((item) => <Render key={item.id} answer={item} />)
          )}
        </section>
      </section>
    </>
  );
};

export default ReactQuillEditor;
