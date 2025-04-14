import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';
import { Separator } from '@/app/_components/ui/separator';
import { Textarea } from '@/app/_components/ui/textarea';
import { useAiFabricStream, useAiGenerateImage } from '@/app/_hook/query/useAi';
import { useUser } from '@/app/_store/auth';
import type { Edit } from '@/app/_types/Edit';
import type * as fabric from 'fabric';
import { ChevronDown, ChevronUp, Send, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRobot } from 'react-icons/fa6';
import AvatarImage from '../../Comand/AvatarImage';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import AiPreview from './AiPreview';

export type AiFabricObjects = fabric.FabricObjectProps & {
  type: string;
  fill?: string;
  text?: string;
  points?: fabric.Point[];
  path?: fabric.TSimpleParsedCommand[];
};
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
  objects?: AiFabricObjects[];
  imageUrl?: string;
};
const objName = {
  Circle: '圆形',
  Rect: '矩形',
  Triangle: '三角形',
  Polygon: '多边形',
  Path: '路径',
  Textbox: '文本框',
};
// editor={editor}
export const AiChatSider = ({ editor }: { editor?: Edit }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [changeType, setChangeType] = useState<'fabric' | 'image'>('fabric');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const [expandedMessageIds, setExpandedMessageIds] = useState<Set<string>>(new Set());
  const { getAiFabricStream, getAiFabricStreamPending } = useAiFabricStream();
  const { generateImage, generateImagePending } = useAiGenerateImage();

  const isLoading = isLoadingText || isGeneratingImage;

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current && 'scrollIntoView' in messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 组件卸载时取消流读取
  useEffect(() => {
    return () => {
      // 清理函数：取消任何正在进行的流读取
      if (readerRef.current) {
        readerRef.current.cancel('Component unmounted').catch(console.error);
        readerRef.current = null;
      }
    };
  }, []);

  // 处理SSE事件数据
  const handleSSEData = (data: string) => {
    try {
      // 检查数据是否包含事件类型
      if (data.startsWith('event:')) {
        // 解析事件类型和数据
        const eventMatch = data.match(/event:\s*(\w+)/);
        const dataMatch = data.match(/data:\s*({.*})/);
        // console.log(eventMatch);
        if (eventMatch && dataMatch) {
          const eventType = eventMatch[1];
          const eventData = JSON.parse(dataMatch[1]);
          const imageData = JSON.parse(dataMatch[1]);

          // console.log(`Received ${eventType} event:`, eventData);
          switch (eventType) {
            case 'status':
              setStreamStatus(eventData.message || eventData.status);
              break;

            case 'result':
              if (eventData.objects && eventData.objects.length > 0) {
                // 添加AI响应消息
                const aiMessage: Message = {
                  id: nanoid(),
                  role: 'assistant',
                  content: `我已根据您的描述生成了${eventData.objects.length}个对象。`,
                  timestamp: new Date(),
                  objects: eventData.objects,
                  type: 'text',
                };

                setMessages((prev) => [...prev, aiMessage]);

                // 如果有canvas实例，将对象添加到canvas
                // 设置背景色（如果有）
              }
              break;

            case 'error':
              const errorMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: `抱歉，生成对象时出现错误: ${eventData.error || '未知错误'}`,
                timestamp: new Date(),
                type: 'text',
              };

              setMessages((prev) => [...prev, errorMessage]);
              break;
            case 'image':
              const aiMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: `data:${imageData.mimeType};base64,${imageData.content}`,
                timestamp: new Date(),
                objects: eventData.objects,
                type: 'image',
              };

              setMessages((prev) => [...prev, aiMessage]);

              break;
            case 'complete':
              setIsLoadingText(false);
              break;
            case 'end':
              setIsLoadingText(false);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error, data);
    }
  };

  // 取消当前流读取
  const cancelCurrentStream = () => {
    if (readerRef.current) {
      readerRef.current.cancel('Stream reading cancelled').catch(console.error);
      readerRef.current = null;
      setIsLoadingText(false);
      setStreamStatus('');
    }
  };
  // 处理图像生成
  const handleGenerateImage = async () => {
    if (!inputValue.trim() || isLoading) return;

    cancelCurrentStream();

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsGeneratingImage(true);
    setStreamStatus('AI正在生成图像...');

    try {
      // 调用AI图像生成API
      generateImage(
        {
          json: {
            prompt: currentInput, // 使用用户输入作为提示词
          },
        },
        {
          onSuccess: async (datas) => {
            const errorMessage: Message = {
              id: nanoid(),
              role: 'assistant',
              content: datas.data.imageBase64,
              timestamp: new Date(),
              type: 'image',
            };

            setMessages((prev) => [...prev, errorMessage]);
            setStreamStatus('');
          },
          onError: (error: Error) => {
            console.error('图像生成失败:', error);
            const errorMessage: Message = {
              id: nanoid(),
              role: 'assistant',
              content: `抱歉，生成图像时出现错误: ${error.message}`,
              timestamp: new Date(),
              type: 'text',
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsGeneratingImage(false);
            setStreamStatus('');
          },
          onSettled: () => {
            setStreamStatus('');
            setIsGeneratingImage(false);
          },
        },
      );
    } catch (error) {
      console.error('图像生成失败:', error);
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: `抱歉，生成图像时出现错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsGeneratingImage(false);
      setStreamStatus('');
    }
  };

  // 发送消息并获取AI Fabric对象响应
  const handleSendMessage = async () => {
    if (changeType === 'fabric') {
      if (!inputValue.trim() || isLoading) return;

      // 如果有正在进行的请求，先取消它
      cancelCurrentStream();

      // 添加用户消息
      const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content: inputValue,
        type: 'text',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue('');
      setIsLoadingText(true);
      setStreamStatus('AI正在生成图形...');

      try {
        // 调用AI生成Fabric.js对象
        getAiFabricStream(
          {
            json: {
              prompt: currentInput,
            },
          },
          {
            onSuccess: async (stream: ReadableStream) => {
              // 处理ReadableStream
              const reader = stream.getReader();
              readerRef.current = reader;
              const decoder = new TextDecoder();
              let buffer = '';

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  // 解码二进制数据
                  const chunk = decoder.decode(value, { stream: true });
                  buffer += chunk;

                  // 处理可能的多行SSE数据
                  const lines = buffer.split('\n\n');

                  // 处理除最后一行外的所有完整行
                  for (let i = 0; i < lines.length - 1; i++) {
                    if (lines[i].trim()) {
                      handleSSEData(lines[i]);
                    }
                  }

                  // 保留最后一行（可能不完整）
                  buffer = lines[lines.length - 1];
                }

                // 处理最后的数据
                if (buffer.trim()) {
                  handleSSEData(buffer);
                }

                // 流结束
                readerRef.current = null;
                setIsLoadingText(false);
                setStreamStatus('');
              } catch (error) {
                // 检查是否是取消错误
                if (error instanceof Error && error.name === 'AbortError') {
                  // console.log('Stream reading was cancelled');
                  return;
                }
                if (error instanceof DOMException && error.name === 'AbortError') {
                  // 处理 AbortError，可能是由 cancelCurrentStream 引起的
                  return;
                }

                console.error('Error reading stream:', error);
                setIsLoadingText(false);

                const errorMessage: Message = {
                  id: nanoid(),
                  role: 'assistant',
                  content: `抱歉，读取响应时出现错误: ${error instanceof Error ? error.message : '未知错误'}`,
                  timestamp: new Date(),
                  type: 'text',
                };

                setMessages((prev) => [...prev, errorMessage]);
              }
            },
            onError: (error: Error) => {
              // 添加错误消息
              const errorMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: `抱歉，生成对象时出现错误: ${error.message}`,
                timestamp: new Date(),
                type: 'text',
              };

              setMessages((prev) => [...prev, errorMessage]);
              console.error('生成对象失败', error);
              setIsLoadingText(false);
              readerRef.current = null;
            },
            onSettled: () => {
              // 不在此处设置 isLoadingText 为 false，在 complete 或 error 中处理
            },
          },
        );
      } catch (error) {
        console.error('Error:', error);
        setIsLoadingText(false);

        // 添加错误消息
        const errorMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: `抱歉，发生了错误: ${error instanceof Error ? error.message : '未知错误'}`,
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
      return;
    }
    await handleGenerateImage();
  };

  // 添加对象到画布的辅助函数
  const addObjectsToCanvas = (objects: AiFabricObjects[]) => {
    if (!editor || !objects || objects.length === 0) return;
    editor.addObjectsToCanvas(objects);
  };

  // 清空聊天记录
  const clearMessages = () => {
    cancelCurrentStream();
    setIsGeneratingImage(false);
    setMessages([]);
    setStreamStatus('');
    setExpandedMessageIds(new Set());
    toast.success('已清空聊天记录');
  };

  // 新增：切换对象列表展开/收起状态
  const toggleExpandMessage = (messageId: string) => {
    setExpandedMessageIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-[70dvh] px-4 pt-4 bg-background border-l border-border/40">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaRobot className="h-5 w-5 text-primary" />
          <h2 className="font-medium text-sm">AI 设计助手</h2>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={clearMessages}
            title="清空聊天记录"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-4 space-y-3 bg-muted/30 p-5 rounded-lg shadow-sm">
            <FaRobot className="mx-auto h-10 w-10 mb-2 text-primary/70" />
            <h3 className="text-base font-medium">AI 设计助手</h3>
            <p className="text-sm">您可以描述您想要的设计，AI将为您生成对应的图形或图像。</p>
            <div className="bg-muted/60 p-4 rounded-md text-sm mt-2 text-left shadow-inner">
              <p className="font-medium mb-2">示例提示:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>"绘制一个红色的圆和一个蓝色的矩形" </li>
                <li>"生成一张宇航员在月球上骑自行车的图片"</li>
                <li>"设计一个简单的标志，包含圆形和文字 '科技'"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            // 检查当前消息是否展开
            const isExpanded = expandedMessageIds.has(msg.id);
            // 决定显示的对象列表
            const objectsToShow =
              msg.objects && msg.objects.length > 0
                ? isExpanded
                  ? msg.objects // 显示全部
                  : msg.objects.slice(0, 3) // 显示前3个
                : [];
            const canExpand = msg.objects && msg.objects.length > 3; // 是否可以展开

            return (
              <div
                key={msg.id}
                className="grid grid-cols-[40px_1fr] gap-2 items-start mb-1 animate-in slide-in-from-bottom-2 duration-200"
              >
                <div className="self-start mt-1">
                  {msg.role === 'user' ? (
                    <AvatarImage
                      userInfo={user?.user.user_metadata!}
                      src={user?.user.user_metadata?.image || ''}
                      alt="用户头像"
                      priority
                      width={32}
                      height={32}
                      className="rounded-full border border-border/30"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FaRobot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>

                {msg.type === 'text' && (
                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary/10 text-foreground'
                          : msg.imageUrl
                            ? 'bg-purple-500/10 text-foreground border border-purple-200/20'
                            : 'bg-green-500/10 text-foreground border border-green-200/20'
                      } text-sm leading-relaxed`}
                    >
                      {msg.content}
                    </div>
                  </div>
                )}
                {msg.type === 'image' && (
                  <Card className="col-span-full mt-2 p-3 border border-border/50 bg-card/80 shadow-sm">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p>生成的图片</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 mt-1 mb-2">
                        <Image
                          src={msg.content}
                          alt="图片"
                          width={300}
                          height={200}
                          className="object-cover"
                        />
                      </div>

                      <Button
                        size="sm"
                        variant="default"
                        className="w-full mt-1 text-xs bg-primary/90 hover:bg-primary"
                        onClick={() => editor?.addAiImage(msg?.content)}
                      >
                        添加到画布
                      </Button>
                    </div>
                  </Card>
                )}
                {/* 如果消息包含对象，显示对象卡片 */}
                {msg.type === 'text' && msg.objects && msg.objects.length > 0 && (
                  <Card className="col-span-full mt-2 p-3 border border-border/50 bg-card/80 shadow-sm">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-xs flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          生成的对象 ({msg.objects.length})
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 mt-1 mb-2">
                        {objectsToShow.map((obj) => (
                          <div
                            key={nanoid()}
                            className="bg-muted/50 p-2 rounded text-xs flex flex-col items-center justify-between hover:bg-muted/80 transition-colors"
                            title={obj.type}
                          >
                            <div className="flex items-center gap-1.5">
                              {objName[obj.type as keyof typeof objName] || obj.type}
                              {obj?.fill && typeof obj.fill === 'string' && (
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-border/30"
                                  style={{ backgroundColor: obj?.fill }}
                                />
                              )}
                            </div>
                            <AiPreview objects={obj as AiFabricObjects} editor={editor} />
                          </div>
                        ))}
                        {/* 显示更多/收起按钮 */}
                        {canExpand && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-1 text-xs text-muted-foreground justify-center h-7"
                            onClick={() => toggleExpandMessage(msg.id)}
                          >
                            {isExpanded ? (
                              <>
                                收起 <ChevronUp className="ml-1 h-3 w-3" />
                              </>
                            ) : (
                              <>
                                显示其余 {msg.objects.length - 3} 个对象{' '}
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="default"
                        className="w-full mt-1 text-xs bg-primary/90 hover:bg-primary"
                        onClick={() => addObjectsToCanvas(msg?.objects || ([] as any))}
                      >
                        添加到画布
                      </Button>
                    </div>
                  </Card>
                )}

                <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <Separator className="my-3" />

      {/* 输入区域 */}
      <div className="mt-auto relative">
        {(isLoading || getAiFabricStreamPending || generateImagePending) && (
          <div className="text-center mt-2 flex items-center justify-center gap-2 bg-muted/30 py-1 px-2 rounded-full">
            <div
              className={`animate-pulse h-1.5 w-1.5 rounded-full ${isGeneratingImage ? 'bg-purple-500' : 'bg-primary'}`}
            />
            <div
              className={`animate-pulse h-1.5 w-1.5 rounded-full ${isGeneratingImage ? 'bg-purple-500' : 'bg-primary'}`}
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className={`animate-pulse h-1.5 w-1.5 rounded-full ${isGeneratingImage ? 'bg-purple-500' : 'bg-primary'}`}
              style={{ animationDelay: '0.4s' }}
            />
            <span className="text-xs text-muted-foreground ml-1">
              {streamStatus || (isGeneratingImage ? 'AI正在生成图像...' : 'AI正在生成图形...')}
            </span>
          </div>
        )}
        <section className="flex items-center space-x-2 mb-2">
          <Checkbox
            value={changeType}
            onClick={(data) => {
              // @ts-ignore
              setChangeType(() => (data.target.value === 'image' ? 'fabric' : 'image'));
            }}
            disabled={isLoading || getAiFabricStreamPending || generateImagePending}
          />
          <Label htmlFor="airplane-mode"> 生成图像</Label>
        </section>
        <Textarea
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
          placeholder="描述图形或图像..."
          rows={2}
          className="pr-20 resize-none border-muted focus-visible:ring-1 focus-visible:ring-primary/50 shadow-sm text-sm rounded-md"
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || getAiFabricStreamPending || generateImagePending}
        />
        <div className="absolute right-2 bottom-2 flex gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={isLoading || getAiFabricStreamPending || generateImagePending}
                >
                  {isLoadingText ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent border-white" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>生成{changeType === 'image' ? '图片' : '图型'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
