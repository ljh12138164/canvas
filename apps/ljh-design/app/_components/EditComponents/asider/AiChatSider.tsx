'use client';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group';
import { ScrollArea } from '@/app/_components/ui/scroll-area';
import { useAi } from '@/app/_hook/query/useAi';
import {
  // createAi,
  getAiChatById,
  getIndexDB,
  indexDBChange,
} from '@/app/_lib/ai';
import { Message, type MessageArr } from '@/app/_types/ai';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import MarkDown from 'react-markdown';
import { z } from 'zod';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { Skeleton } from '../../ui/skeleton';
// 聊天的表单
const zod = z.object({
  input: z.string().min(1, { message: '请输入消息' }),
});
// 创建新会话
const newsZod = z.object({
  title: z.string(),
});

export const AiChatSider = () => {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);
  // 全部会话列表
  const [ai, setAi] = useState<MessageArr[]>([]);
  // 当前会话id
  const [currentId, setCurrentId] = useState<string>(localStorage.getItem('current_ai_id') || '');

  const [selectId, setSelectId] = useState<string>(currentId);
  // 聊天的表单
  const { register, handleSubmit, reset, formState } = useForm<z.infer<typeof zod>>({
    resolver: zodResolver(zod),
  });
  // 新建会话的表单
  const {
    register: newsRegister,
    handleSubmit: newsHandleSubmit,
    formState: newsFormState,
  } = useForm<z.infer<typeof newsZod>>({
    resolver: zodResolver(newsZod),
  });

  const { getAiStream, getAiStreamPending } = useAi();
  // 获取全部会话
  useEffect(() => {
    (async () => {
      const res = await getIndexDB();
      // console.log(res);
      // 初始化全部上下文
      // if (!res.length) {
      //   // 创建新对话
      //   const newId = nanoid();
      //   const newName = "新对话" + nanoid(4);
      //   setCurrentId(newId);
      //   localStorage.setItem("current_ai_id", newId);
      //   const history: Message[] = [
      //     {
      //       role: "user",
      //       parts: [{ text: "你好！我是你的智能助理，有什么可以帮助您的吗？" }],
      //     },
      //   ];
      //   console.log(history);
      //   setLoading(false);
      //   getAiStream(
      //     {
      //       json: {
      //         prompt: "你好！我是你的智能助理，有什么可以帮助您的吗？",
      //       },
      //     },
      //     {
      //       onSuccess: (data) => {
      //         const reader = data.getReader();
      //         let chunks = "";
      //         reader.read().then(async function processText({ done, value }) {
      //           if (done) {
      //             history.push({
      //               role: "model",
      //               parts: [{ text: chunks }],
      //             });
      //             // 创建新对话
      //             await createAi(newId, history, newName);
      //             return;
      //           }
      //           const uint8Array = new Uint8Array(value);
      //           chunks += new TextDecoder("utf-8").decode(uint8Array);
      //           flushSync(() => {
      //             setAi((prev) => {
      //               const newArr = [...prev].filter(
      //                 (item) => item.id !== newId
      //               );
      //               newArr.push({
      //                 id: newId,
      //                 history: history,
      //                 name: newName,
      //               });
      //               return newArr;
      //             });
      //           });
      //           reader.read().then(processText);
      //         });
      //       },
      //       onSettled: () => {
      //         setLoading(false);
      //       },
      //     }
      //   );
      // } else {
      //   setAi(res);
      //   setLoading(false);
      // }
    })();
  }, []);
  const handleSend = async (data: z.infer<typeof zod>) => {
    if (!data.input.trim()) {
      toast.error('请输入消息');
      return;
    }
    // 更新状态
    if (!currentId) {
      toast.error('请先选择一个会话');
      return;
    }

    const res = await getAiChatById(currentId);
    if (!res) {
      toast.error('未找到会话');
      return;
    }
    res.history.push({
      role: 'user',
      parts: [{ text: data.input }],
    });
    // 更新indexDB
    await indexDBChange({
      type: 'add',
      data: res,
      id: currentId,
    });
    // 创建新会话
    getAiStream(
      {
        json: {
          prompt: data.input,
          history: res.history,
        },
      },
      {
        onSuccess: (data) => {
          const reader = data.getReader();
          let chunks = '';
          const id = nanoid();
          reader.read().then(async function processText({ done, value }) {
            if (done) {
              const res = await getAiChatById(currentId);
              if (!res) {
                toast.error('未找到会话');
                return;
              }
              res.history.push({
                role: 'model',
                parts: [{ text: chunks }],
              });
              // 创建新对话到indexDB
              await indexDBChange({
                type: 'add',
                data: res,
                id: currentId,
              });
              await getAiChatById(id);
              reset();
              return;
            }
            const uint8Array = new Uint8Array(value);
            chunks += new TextDecoder('utf-8').decode(uint8Array);
            flushSync(() => {
              setAi((prev) => {
                const newArr = [...prev].filter((item) => item.id !== id);
                newArr.push({
                  id: id,
                  history: res.history.slice(0, -1),
                  name: res.name,
                });
                return newArr;
              });
            });
            reader.read().then(processText);
          });
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };
  const handleCreate = async (data: z.infer<typeof newsZod>) => {};

  if (loading)
    return (
      <div className="flex flex-col h-full gap-4">
        <section className="flex items-center justify-between gap-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </section>
        <Skeleton className="h-[calc(100vh-230px)]" />
        <Separator className="mt-6" />
        <Skeleton className="h-10" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <section className="flex items-center justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <span>选择会话</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[99999]">
            <section>
              <DialogHeader>
                <DialogTitle>选择会话</DialogTitle>
                <DialogDescription>选择一个会话，继续聊天</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[45dvh]  p-4">
                <div className="flex items-center py-2 justify-center">
                  <RadioGroup
                    defaultValue={selectId}
                    onValueChange={(value) => {
                      setSelectId(value);
                    }}
                  >
                    {ai.map((chat) => (
                      <div key={chat.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={chat.id} id={chat.id} />
                        <Label htmlFor={chat.id}>{chat.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </ScrollArea>
              <DialogFooter className="flex items-center gap-2">
                <DialogClose asChild ref={dialogCloseRef}>
                  <Button variant="outline" className="w-full">
                    <span>取消</span>
                  </Button>
                </DialogClose>
                <Button
                  className="w-full"
                  onClick={() => {
                    setCurrentId(selectId);
                    localStorage.setItem('current_ai_id', selectId);
                    dialogCloseRef.current?.click();
                  }}
                >
                  <span>确认</span>
                </Button>
              </DialogFooter>
            </section>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <span>新的会话</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[99999]">
            <DialogHeader>
              <DialogTitle>新的会话</DialogTitle>
              <DialogDescription>创建一个新的会话，开始聊天</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <Input placeholder="请输入会话名称" {...newsRegister('title')} />
              {newsFormState?.errors?.title && <p className="text-red-500">{newsFormState?.errors?.title?.message}</p>}
            </div>
            <DialogFooter>
              <section className="flex items-center justify-end gap-2">
                <DialogClose>
                  <Button variant="outline">
                    <span>取消</span>
                  </Button>
                </DialogClose>
                <form onSubmit={newsHandleSubmit(handleCreate)}>
                  <Button type="submit">
                    <span>创建</span>
                  </Button>
                </form>
              </section>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <ScrollArea className="h-[calc(100vh-230px)] p-4">
        <section>
          {ai
            .find((chat) => chat.id === currentId)
            ?.history.map((message) => (
              <div key={nanoid()} className={`mb-4 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[80%]`}>
                {message.role === 'user' ? (
                  <span>
                    {message.parts[0].text}
                    <span className="text-gray-500">{message.parts[0].text}</span>
                  </span>
                ) : (
                  <MarkDown>{message.parts[0].text}</MarkDown>
                )}
              </div>
            ))}
        </section>
      </ScrollArea>
      <Separator className="mt-4 " />
      <form className="flex gap-2 pt-2" onSubmit={handleSubmit(handleSend)}>
        <Input placeholder="输入消息..." {...register('input')} />
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '发送'}
        </Button>
      </form>
    </div>
  );
};
