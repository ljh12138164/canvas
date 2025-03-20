import { Button } from '@/app/_components/ui/button';
import { Card } from '@/app/_components/ui/card';
import { Separator } from '@/app/_components/ui/separator';
import { Textarea } from '@/app/_components/ui/textarea';
import { useAiFabricStream } from '@/app/_hook/query/useAi';
import { importJsonToFabricObject } from '@/app/_lib/utils';
import { useUser } from '@/app/_store/auth';
import type { Edit } from '@/app/_types/Edit';
import type * as fabric from 'fabric';
import { Send, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRobot } from 'react-icons/fa6';
import AvatarImage from '../../Comand/AvatarImage';
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
  objects?: AiFabricObjects[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const { getAiFabricStream, getAiFabricStreamPending } = useAiFabricStream();

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

        if (eventMatch && dataMatch) {
          const eventType = eventMatch[1];
          const eventData = JSON.parse(dataMatch[1]);

          // console.log(`Received ${eventType} event:`, eventData);

          switch (eventType) {
            case 'status':
              setStreamStatus(eventData.message || eventData.status);
              break;

            case 'result':
              if (eventData.objects && eventData.objects.length > 0) {
                // 添加AI响应消息
                const aiMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: `我已根据您的描述生成了${eventData.objects.length}个对象。`,
                  timestamp: new Date(),
                  objects: eventData.objects,
                };

                setMessages((prev) => [...prev, aiMessage]);

                // 如果有canvas实例，将对象添加到canvas
                // 设置背景色（如果有）
              }
              break;

            case 'error':
              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `抱歉，生成对象时出现错误: ${eventData.error || '未知错误'}`,
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, errorMessage]);
              break;

            case 'complete':
              setIsLoading(false);
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
      setIsLoading(false);
      setStreamStatus('');
    }
  };

  // 发送消息并获取AI响应
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 如果有正在进行的请求，先取消它
    cancelCurrentStream();

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamStatus('AI正在思考...');

    try {
      // 调用AI生成Fabric.js对象
      getAiFabricStream(
        {
          json: {
            prompt: inputValue,
          },
        },
        {
          onSuccess: async (stream) => {
            // 处理ReadableStream
            const reader = stream.getReader();
            readerRef.current = reader; // 保存reader引用以便可以取消
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
              setIsLoading(false);
              setStreamStatus('');
            } catch (error) {
              // 检查是否是取消错误
              if (error instanceof Error && error.name === 'AbortError') {
                // console.log('Stream reading was cancelled');
                return;
              }

              console.error('Error reading stream:', error);
              setIsLoading(false);

              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `抱歉，读取响应时出现错误: ${error instanceof Error ? error.message : '未知错误'}`,
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, errorMessage]);
            }
          },
          onError: (error: Error) => {
            // 添加错误消息
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `抱歉，生成对象时出现错误: ${error.message}`,
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
            console.error('生成对象失败', error);
            setIsLoading(false);
            readerRef.current = null;
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);

      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，发生了错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // 添加对象到画布的辅助函数
  const addObjectsToCanvas = (objects: AiFabricObjects[]) => {
    if (!editor || !objects || objects.length === 0) return;
    const obj = importJsonToFabricObject(objects);
    if (!obj) return;
    editor.canvas?.add(...obj);
    editor.canvas?.renderAll();
    toast.success('已将对象添加到画布');
  };

  // 清空聊天记录
  const clearMessages = () => {
    // 取消任何正在进行的流读取
    cancelCurrentStream();
    setMessages([]);
    toast.success('已清空聊天记录');
  };

  return (
    <div className="flex flex-col h-[70dvh] p-4 bg-background">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-4 pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8 space-y-3 bg-muted/30 p-6 rounded-lg">
            <FaRobot className="mx-auto h-10 w-10 mb-3 text-primary/60" />
            <h3 className="text-base font-medium">AI 设计助手</h3>
            <p className="text-sm">您可以描述您想要的设计，AI将为您生成对应的图形对象</p>
            <div className="bg-muted/50 p-3 rounded-md text-sm mt-2 text-left">
              <p className="font-medium mb-2">示例提示:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>"绘制一个红色的圆和一个蓝色的矩形"</li>
                <li>"创建一个带有渐变填充的五角星"</li>
                <li>"设计一个简单的标志，包含圆形和文字"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="grid grid-cols-[50px_1fr] items-start mb-1 animate-fadeIn">
              {msg.role === 'user' ? (
                <AvatarImage
                  src={user?.user.user_metadata?.image || ''}
                  alt="用户头像"
                  priority
                  width={40}
                  height={40}
                />
              ) : (
                <FaRobot style={{ color: '#000', width: '40px', height: '40px' }} />
              )}
              <div
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary/10 text-foreground'
                    : 'bg-green-500/10 text-foreground'
                }`}
              >
                {msg.content}
              </div>
              <div className="flex-1 space-y-1 pt-0.5 col-span-full">
                {/* 如果消息包含对象，显示对象卡片 */}
                {msg?.objects && msg?.objects?.length > 0 && (
                  <Card className="mt-2 p-3 border border-border/50 shadow-sm ">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                          生成的对象 ({msg.objects.length})
                        </p>
                      </div>
                      <div className="flex flex-col mt-1 mb-2">
                        {msg.objects.slice(0, 3).map((obj) => (
                          <div
                            key={nanoid()}
                            className="bg-muted/40 p-2 rounded text-xs truncate"
                            title={obj.type}
                          >
                            {objName[obj.type as keyof typeof objName]}
                            {obj?.fill && (
                              <span
                                className="inline-block w-2 h-2 ml-1 rounded-full"
                                style={{ backgroundColor: obj?.fill }}
                              />
                            )}
                            {/* 预览图 */}
                            <AiPreview objects={obj as AiFabricObjects} editor={editor} />
                          </div>
                        ))}
                        {msg.objects.length > 3 && (
                          <div className="bg-muted/40 p-2 rounded text-xs truncate">
                            +{msg.objects.length - 3} 更多
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => addObjectsToCanvas(msg?.objects || ([] as any))}
                        // disabled={!canvas}
                      >
                        应用到画布
                      </Button>
                    </div>
                  </Card>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <Separator className="my-3" />

      {/* 输入区域 */}
      <div className="mt-auto relative">
        <Textarea
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
          placeholder="描述您想要的设计..."
          rows={2}
          className="pr-10 resize-none border-muted focus-visible:ring-primary"
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || getAiFabricStreamPending}
        />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 bg-primary hover:bg-primary/90"
          onClick={handleSendMessage}
          disabled={isLoading || getAiFabricStreamPending}
        >
          {isLoading || getAiFabricStreamPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {(isLoading || getAiFabricStreamPending) && (
        <div className="text-center mt-2 flex items-center justify-center gap-2">
          <div className="animate-pulse h-2 w-2 rounded-full bg-primary" />
          <div
            className="animate-pulse h-2 w-2 rounded-full bg-primary"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="animate-pulse h-2 w-2 rounded-full bg-primary"
            style={{ animationDelay: '0.4s' }}
          />
          <span className="text-sm text-muted-foreground ml-1">
            {streamStatus || 'AI正在思考...'}
          </span>
        </div>
      )}
    </div>
  );
};
