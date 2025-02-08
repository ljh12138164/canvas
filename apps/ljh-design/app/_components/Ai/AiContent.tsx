'use client';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { uploadImageclound } from '@/app/_database/image';
import {
  useAiChat,
  useAiImage,
  useAiSessionDetail,
  useAiSessionUpdate,
} from '@/app/_hook/query/useAi';
import { useBoardImageQuery, useUserImageQuery } from '@/app/_hook/query/useImageQuery';
import { cn } from '@/app/_lib/utils';
import { useUser } from '@/app/_store/auth';
import { IMAGE_BLUSK } from '@/app/_types/Edit';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import to from 'await-to-js';
import { ArrowDown, ArrowLeft, Loader2, Plus, Upload, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { PhotoProvider, PhotoView } from 'react-photo-view';
// 代码高亮
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 代码高亮样式
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Response } from '../Comand/Response';
import { Badge } from '../ui/badge';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import CreatePop from './CreatePop';
const AI = ({ id }: { id: string }) => {
  const responseRef = useRef<{ closeModel: () => void }>(null);
  const { user } = useUser();
  const router = useRouter();
  const { data: userDate, isLoading: userDataLoading } = useBoardImageQuery({
    userId: user?.user.id,
  });
  // ai
  const { getAiChat } = useAiChat();
  const { getAiImage, getAiImagePending } = useAiImage();
  // 保存数据库
  const { getAiSessionDetail, getAiSessionDetailLoading } = useAiSessionDetail(id);
  const { getAiSessionUpdate, getAiSessionUpdatePending } = useAiSessionUpdate();
  // 读图片
  const [image, setImage] = useState<string>('');
  const [uploadImage, setUploadImage] = useState(false);
  const { mutate, isPending } = useUserImageQuery();
  const queryClient = useQueryClient();
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const [messages, setMessages] = useState<
    {
      role: 'user' | 'model';
      type: 'text' | 'image';
      parts: { text: string }[];
    }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 初始化后，滚动到最底部
    if (getAiSessionDetail) {
      // 类型断言
      setMessages(getAiSessionDetail.history ?? ([] as any));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [getAiSessionDetail]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsScrollToBottom(true);
        else setIsScrollToBottom(false);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      },
    );
    observer.observe(messagesEndRef.current);
    return () => observer.disconnect();
  }, [messages]);
  useEffect(() => {
    if (messagesEndRef.current) setIsScrollToBottom(true);
  }, [messagesEndRef.current]);

  const genData = useMemoizedFn(
    (
      data: ReadableStream<Buffer>,
      newMessages: Array<{
        history: {
          type: 'text' | 'image';
          role: 'user' | 'model';
          parts: {
            text: string;
          }[];
        }[];
      }>,
    ) => {
      const reader = data.getReader();
      // 读取流
      let aiResponse = '';
      reader.read().then(async function processText({ done, value }) {
        if (done) {
          const text = new TextDecoder('utf-8').decode(value);
          aiResponse += text;
          // 保存消息
          newMessages.pop();
          newMessages.push({
            history: [{ role: 'model', parts: [{ text: aiResponse }] }],
            type: image ? 'image' : 'text',
            imagePrompt: input,
          });
          setMessages(newMessages);
          getAiSessionUpdate({
            json: {
              id,
              // 只保存最后20条消息
              history: newMessages.slice(-20),
            },
          });
          setInput('');
          setImage('');
          setLoading(false);
          return;
        }
        const text = new TextDecoder('utf-8').decode(value);
        aiResponse += text;
        newMessages.pop();
        newMessages.push({
          history: [{ role: 'model', parts: [{ text: aiResponse }] }],
          type: image ? 'image' : 'text',
          imagePrompt: input,
        });
        setMessages(newMessages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        reader.read().then(processText);
      });
    },
  );

  const handleSend = async () => {
    if (getAiSessionDetailLoading || loading) return;
    if (!input.trim() && !image) {
      toast.dismiss();
      toast.error('请输入消息或上传图片');
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setLoading(true);
    const newMessages: Array<{
      history: { role: 'user' | 'model'; parts: { text: string }[] }[];
      type: 'text' | 'image';
      imagePrompt?: string;
    }> = [
      ...messages,
      {
        history: image ? [{ role: 'user', parts: [{ text: input }] }] : [],
        type: image ? 'image' : 'text',
        imagePrompt: input,
      },
      { history: [{ role: 'model', parts: [{ text: '' }] }], type: 'text' },
    ];
    // 添加用户消息
    setMessages(newMessages);
    if (!image) {
      // 流式传输
      getAiChat(
        { json: { prompt: input, history: messages } },
        {
          onSuccess(data) {
            genData(data, newMessages);
          },
          onError() {
            toast.error('请求失败');
            newMessages.pop();
            newMessages.pop();
            setMessages(newMessages);
            setLoading(false);
          },
        },
      );
    } else {
      getAiImage(
        { json: { image, prompt: input, history: messages } },
        {
          onSuccess(data) {
            genData(data, newMessages);
          },
          onError() {
            toast.error('请求失败');
            newMessages.pop();
            newMessages.pop();
            setMessages(newMessages);
            setLoading(false);
          },
        },
      );
    }
  };

  if (getAiSessionDetailLoading || userDataLoading)
    return (
      <main className="flex  flex-col h-[calc(100dvh-100px)]">
        <header className="h-16">
          <Skeleton className="w-full h-full" />
        </header>
        <section className="flex-1 py-2 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin" />
        </section>
        <section className="h-12">
          <Skeleton className="w-full h-full" />
        </section>
      </main>
    );

  return (
    <section className="flex flex-col justify-between h-full p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft />
            返回
          </Button>
          <h1 className="text-2xl font-bold flex flex-col">
            <span>{getAiSessionDetail?.name}</span>
            <span className="text-sm text-muted-foreground">聊天只保存最后20条</span>
          </h1>
        </div>
        <CreatePop />
      </header>
      <ScrollArea className="flex flex-col   h-[calc(100dvh-200px)] w-full mx-auto p-4 relative">
        <div className="flex-1 overflow-auto mb-4 space-y-4 ">
          {messages.map((message) => {
            return (
              <div
                key={nanoid()}
                className={cn(
                  'flex w-full',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted max-w-full',
                  )}
                >
                  {message.type === 'text' ? (
                    message.parts.map((part) => (
                      <ScrollArea key={nanoid()} className="w-full overflow-x-auto p-2">
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // 代码高亮
                            code(props) {
                              const { children, className, node, ref, ...rest } = props;
                              const match = /language-(\w+)/.exec(className || '');
                              return match ? (
                                <SyntaxHighlighter
                                  {...rest}
                                  className="rounded-md"
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code {...rest} className={className}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {part.text}
                        </Markdown>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    ))
                  ) : (
                    <section className="w-full h-full flex items-center justify-center">
                      <Image
                        src={message.parts?.[0].text}
                        alt="图片"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <span className="text-sm text-muted-foreground">{message.imagePrompt}</span>
                    </section>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
        {!isScrollToBottom && (
          <section className="h-12 absolute bottom-0 left-[50%] translate-y-[-50%] animate-scroll-to-bottom">
            <Button
              variant="outline"
              size="icon"
              onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ArrowDown />
            </Button>
          </section>
        )}
      </ScrollArea>
      <div className="flex gap-2 mt-auto h-12">
        <section className="flex flex-col gap-2 w-full">
          <div className="w-full h-[30px]">
            {/* <Br></> */}
            {image && (
              <Badge variant="outline" className="flex items-center gap-2 w-[90px] h-full">
                <PhotoProvider>
                  <PhotoView src={image}>
                    <Image src={image} alt="图片" width={10} height={10} />
                  </PhotoView>
                </PhotoProvider>
                图片
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    if (!getAiImagePending) setImage('');
                  }}
                />
              </Badge>
            )}
            <div className="h-full" />
          </div>
          <div className="flex gap-2 w-full ">
            <Response
              myTrigger={
                <Button variant="outline" size="icon">
                  <Upload />
                </Button>
              }
              // className="w-[800px] flex gap-2 h-[400px] "
              title="选择图片"
              description="选择图片后，可以更好地帮助AI理解你的需求"
              ref={responseRef}
              onConfirm={() => {
                responseRef.current?.closeModel();
              }}
            >
              <ScrollArea className="h-[300px] flex">
                <section className="flex gap-2 flex-wrap pt-2">
                  <Button
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                    className="flex flex-col items-center justify-center h-[110px] w-[110px]"
                    variant="outline"
                    disabled={uploadImage || isPending}
                  >
                    <Plus />
                    <span>添加图片</span>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (isPending) return;
                        setUploadImage(true);
                        toast.loading('上传图片中...');
                        if (e.target.files?.[0]) {
                          const [err, url] = await to(
                            uploadImageclound({
                              file: e.target.files?.[0],
                            }),
                          );
                          toast.dismiss();
                          if (err) {
                            toast.error('上传失败');
                          } else {
                            mutate(
                              {
                                json: {
                                  url: IMAGE_BLUSK + url,
                                },
                              },
                              {
                                onSuccess: () => {
                                  toast.dismiss();
                                  toast.success('上传成功');
                                  queryClient.invalidateQueries({
                                    queryKey: ['boardImage'],
                                  });
                                },
                              },
                            );
                          }
                          setUploadImage(false);
                          e.target.value = '';
                        }
                      }}
                    />
                  </Button>
                  {userDate?.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        'p-0 h-[110px] w-[110px] hover:opacity-80 border-1 border-transparent',
                        image === item.url && 'ring-2 ring-primary border-[#1209bb]',
                      )}
                      onClick={() => {
                        if (item.url === image) setImage('');
                        setImage(item.url);
                      }}
                    >
                      <Image
                        src={item.url}
                        alt="图片"
                        width={100}
                        height={100}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </Button>
                  ))}
                </section>
              </ScrollArea>
            </Response>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              className="flex-1"
              disabled={loading || getAiSessionUpdatePending || getAiImagePending}
            />
            <Button
              onClick={handleSend}
              disabled={loading || getAiSessionUpdatePending || getAiImagePending}
            >
              发送
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AI;
