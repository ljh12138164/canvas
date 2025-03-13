'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send } from 'lucide-react';
import mermaid from 'mermaid';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useAiFabricStream } from '../_hooks/useAi';
import { getIndexDB, indexDBChange } from '../_lib/indexDB';
// 定义图表数据类型
interface GrapData {
  id: string;
  name: string;
  role: string;
  code: string;
  messages: any[];
  timestamp: Date;
}

export default function Grap() {
  const [code, setCode] = useState(
    'graph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[Server01]\n    B --> D[Server02]',
  );
  const [svg, setSvg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>('');
  const { getAiFabricStream } = useAiFabricStream();
  const [error, setError] = useState('');
  const [savedGraphs, setSavedGraphs] = useState<GrapData[]>([]);
  const [currentGraphId, setCurrentGraphId] = useState<string>('');
  const [showSavedGraphs, setShowSavedGraphs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  // 加载保存的图表数据
  useEffect(() => {
    loadSavedGraphs();
    mermaid.initialize({ startOnLoad: true });
    updateDiagram();
  }, []);

  // 加载保存的图表
  const loadSavedGraphs = async () => {
    try {
      const data = await getIndexDB();
      const graphData = data.filter((item) => item.role === 'graph') as GrapData[];
      setSavedGraphs(graphData);
    } catch (error) {
      console.error('加载保存的图表失败:', error);
    }
  };

  // 保存当前图表
  const saveCurrentGraph = async () => {
    try {
      const id = currentGraphId || nanoid();
      const graphName = prompt('请输入图表名称', `图表 ${new Date().toLocaleString()}`);

      if (!graphName) return null; // 用户取消了输入

      const graphData: GrapData = {
        id,
        name: graphName,
        role: 'graph',
        code,
        messages,
        timestamp: new Date(),
      };

      await indexDBChange({
        type: currentGraphId ? 'edit' : 'add',
        data: currentGraphId ? undefined : graphData,
        editData: currentGraphId ? graphData : undefined,
      });

      setCurrentGraphId(id);
      await loadSavedGraphs();
      return id;
    } catch (error) {
      console.error('保存图表失败:', error);
      setError('保存图表失败，请稍后重试');
      return null;
    }
  };

  // 加载指定图表
  // const loadGraph = async (id: string) => {
  //   try {
  //     const graphData = (await getTryBoardById(id)) as GrapData;
  //     if (graphData?.code) {
  //       setCode(graphData.code);
  //       setMessages(graphData.messages || []);
  //       setCurrentGraphId(id);
  //       updateDiagram(graphData.code);
  //       setShowSavedGraphs(false);
  //     }
  //   } catch (error) {
  //     console.error('加载图表失败:', error);
  //     setError('加载图表失败，请稍后重试');
  //   }
  // };

  // // 删除保存的图表
  // const deleteGraph = async (id: string, event?: React.MouseEvent) => {
  //   if (event) {
  //     event.stopPropagation();
  //   }

  //   if (!confirm('确定要删除此图表吗？')) {
  //     return;
  //   }

  //   try {
  //     await indexDBChange({
  //       type: 'delete',
  //       deletItem: id,
  //     });

  //     if (id === currentGraphId) {
  //       setCurrentGraphId('');
  //       setCode(
  //         'graph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[Server01]\n    B --> D[Server02]'
  //       );
  //       setMessages([]);
  //       updateDiagram();
  //     }

  //     await loadSavedGraphs();
  //   } catch (error) {
  //     console.error('删除图表失败:', error);
  //     setError('删除图表失败，请稍后重试');
  //   }
  // };

  // 创建新图表
  const createNewGraph = () => {
    setCurrentGraphId('');
    setCode(
      'graph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[Server01]\n    B --> D[Server02]',
    );
    setMessages([]);
    updateDiagram();
    setShowSavedGraphs(false);
  };

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
            // type: 'classDiagram',
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧面板：输入区域和聊天历史 */}
        {/* <div className='w-full md:w-1/2 space-y-6'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='text-base font-medium'>
                {currentGraphId
                  ? `当前图表: ${savedGraphs.find(
                      (g) => g.id === currentGraphId
                    )?.name || '未命名'}`
                  : '新建图表'}
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowSavedGraphs(!showSavedGraphs)}
                  className='text-xs flex items-center gap-1'
                >
                  <FolderOpen className='h-3 w-3' />
                  {showSavedGraphs ? '隐藏' : '查看'}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={saveCurrentGraph}
                  className='text-xs flex items-center gap-1'
                >
                  <Save className='h-3 w-3' />
                  保存
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={createNewGraph}
                  className='text-xs flex items-center gap-1'
                >
                  <Plus className='h-3 w-3' />
                  新建
                </Button>
              </div>
            </div>
          </div>
        </div> */}
        <div className="w-full md:w-1/2 space-y-6">
          {messages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium">聊天历史</h3>
                <Button variant="outline" size="sm" onClick={clearMessages} className="text-xs">
                  清空聊天
                </Button>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
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
                    {msg.role === 'user' && <Markdown>{msg.content}</Markdown>}
                    {msg.code && (
                      <div className="col-span-2 bg-gray-100 p-2 rounded-lg relative">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl sticky top-6 h-[calc(100vh-250px)] overflow-auto">
            <h3 className="text-base font-medium mb-4">生成的图表</h3>
            <div
              className="mermaid-output flex items-center justify-center min-h-[400px]"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
