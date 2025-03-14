import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import { Textarea } from '@/app/_components/ui/textarea';
import { useAiGrap } from '@/app/_hook/query/useAi';
import { type Edit, Tool } from '@/app/_types/Edit';
import { Bot, Send } from 'lucide-react';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function Grap({
  editor,
  acitiveTool,
  onChangeActiveTool,
}: {
  editor: Edit | undefined;
  acitiveTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}) {
  const [code, setCode] = useState(
    `erDiagram
  客户 ||--o{ 订单 : 包含
  订单 { 
    int 订单ID PK
    varchar 客户ID FK
    date 订单日期
    varchar 订单状态
  }
  客户 {
    int 客户ID PK
    varchar 客户姓名
    varchar 客户地址
    varchar 客户电话
  }
  订单 ||--|{ 订单明细 : 包含
  产品 ||--|{ 订单明细 : 包含
  订单明细 {
    int 订单明细ID PK
    int 订单ID FK
    int 产品ID FK
    int 数量
    decimal 单价
  }
  产品 {
    int 产品ID PK
    varchar 产品名称
    varchar 产品描述
    decimal 产品价格
  }`,
  );
  const [svg, setSvg] = useState('');
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>('');
  const { getAiFabricStream } = useAiGrap();
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    updateDiagram();
  }, []);

  useEffect(() => {
    return () => {
      // 清理函数：取消任何正在进行的流读取
      if (readerRef.current) {
        readerRef.current.cancel('Component unmounted').catch(console.error);
        readerRef.current = null;
      }
    };
  }, []);

  const updateDiagram = async (codes?: string) => {
    try {
      const abc = await mermaid.render('mermaid-diagram', codes ?? code);
      setSvg(abc.svg);
      setError('');
    } catch (error) {
      console.error('渲染失败:', error);
      setError('图表语法错误，请检查您的代码');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    updateDiagram();
  };

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

          switch (eventType) {
            case 'status':
              setStreamStatus(eventData.message || eventData.status);
              break;

            case 'result':
              if (eventData.code) {
                // 添加AI响应消息
                const aiMessage = {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: '我已根据您的描述生成了Mermaid图表代码。',
                  timestamp: new Date(),
                  code: eventData.code,
                };

                setMessages((prev) => [...prev, aiMessage]);
                setCode(eventData.code);
                updateDiagram();
              }
              break;

            case 'error':
              const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `抱歉，生成图表时出现错误: ${eventData.error || '未知错误'}`,
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, errorMessage]);
              setError(eventData.error || '生成图表失败');
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
    const userMessage = {
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
      // 调用API生成Mermaid图表

      getAiFabricStream(
        {
          json: {
            prompt: inputValue,
          },
        },
        {
          onSuccess: async (stream) => {
            // 处理ReadableStream
            // @ts-ignore
            const reader = stream.getReader();
            // @ts-ignore
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

              const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `抱歉，读取响应时出现错误: ${
                  error instanceof Error ? error.message : '未知错误'
                }`,
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, errorMessage]);
            }
          },
          onError: (error: Error) => {
            // 添加错误消息
            const errorMessage = {
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
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，发生了错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setError('请求失败，请稍后重试');
    }
  };
  // 清空聊天记录
  const clearMessages = () => {
    // 取消任何正在进行的流读取
    cancelCurrentStream();
    setMessages([]);
  };

  return (
    <Dialog
      open={acitiveTool === Tool.Grap}
      onOpenChange={(open) => {
        if (!open) {
          onChangeActiveTool(Tool.Presentation);
        }
      }}
    >
      <DialogContent className="w-full max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>生成图表</DialogTitle>
          <DialogDescription>生成图表配置，添加到画布</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 w-full h-full overflow-hidden">
          {/* 左侧面板：输入区域和聊天历史 */}
          <div className="w-full md:w-1/2 space-y-6">
            {messages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium">聊天历史</h3>
                  <Button variant="outline" size="sm" onClick={clearMessages} className="text-xs">
                    清空聊天
                  </Button>
                </div>
                <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto custom-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="grid grid-cols-[40px_1fr] items-start gap-2 p-2 rounded-lg animate-fadeIn"
                    >
                      {msg.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-sm">用户</span>
                        </div>
                      ) : (
                        <Bot className="w-8 h-8 p-1 rounded-full bg-green-100 text-green-600" />
                      )}
                      {msg.role === 'user' && <div>{msg.content}</div>}
                      {msg.code && (
                        <div className="col-span-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg relative">
                          <pre className="text-sm font-mono whitespace-pre-wrap">{msg.code}</pre>
                          <Button
                            className=" absolute right-5 top-2"
                            onClick={() => {
                              setCode(msg.code);
                              updateDiagram(msg.code);
                            }}
                          >
                            应用
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
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
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl">
              <div className="flex mb-4">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="描述您想要的图表..."
                  className="flex-1 p-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg mr-2 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          </div>

          {/* 右侧面板：图表显示区域 */}
          <div className="w-full md:w-1/2">
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="w-full h-40 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="输入Mermaid语法..."
              spellCheck="false"
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl sticky top-6  overflow-auto max-h-[500px]">
              <section className="flex items-center justify-between">
                <h3 className="text-base font-medium mb-4">生成的图表</h3>
                {svg && (
                  <Button
                    onClick={async () => {
                      await editor?.addGrap(canvasRef.current);
                      if (closeRef.current?.click) closeRef.current.click();
                      toast.success('插入成功');
                    }}
                  >
                    保存到画布
                  </Button>
                )}
              </section>
              <div
                ref={canvasRef}
                className="mermaid-output flex items-center justify-center "
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogClose ref={closeRef} />
    </Dialog>
  );
}
