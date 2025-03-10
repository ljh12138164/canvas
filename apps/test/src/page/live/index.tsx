import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import CodePreview from '../../components/CodePreview';
import MDXRenderer from '../../components/MDXRenderer';

export default function CodeEditorApp() {
  const [content, setContent] = useState<string>(`# MDX示例
\`\`\`jsx
function HelloWorld() {
  return <div>Hello, MDX!</div>;
}
\`\`\`

\`\`\`jsx
<div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem' }}>
  <h3>这是一个React组件</h3>
  <p>可以在MDX中直接使用</p>
</div>
\`\`\`
`);

  const [code, setCode] = useState<string>(`// React 组件示例
function MyComponent() {
  // 使用 React hooks
  const [count, setCount] = useState(0);

  return (
    <div className="shadow-sm p-4 rounded-lg border">
      <h4 className="text-lg font-semibold mb-2">React 组件示例</h4>

      <div className="flex items-center gap-2 mb-4">
        <span>当前计数:</span>
        <span className="text-blue-500 font-bold">{count}</span>
      </div>

      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          增加
        </button>

        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          onClick={() => setCount(0)}
        >
          重置
        </button>
      </div>
    </div>
  );
}`);

  const [mode, setMode] = useState<'code' | 'mdx'>('mdx');
  const [error] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [, setKey] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b p-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">代码编辑器</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`px-4 py-2 rounded ${
                mode === 'code'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              代码模式
            </button>
            <button
              type="button"
              onClick={() => setMode('mdx')}
              className={`px-4 py-2 rounded ${
                mode === 'mdx'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              MDX模式
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 max-w-7xl mx-auto w-full">
        <div className="flex h-full gap-4 overflow-hidden rounded-lg shadow-lg bg-white">
          {/* 代码编辑器 */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-2 border-b flex items-center">
              <div className="flex space-x-2 mr-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 font-medium">编辑器</span>
              <div className="ml-auto flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(mode === 'code' ? code : content);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  复制代码
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              {!isEditorReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm text-gray-600">加载编辑器...</span>
                  </div>
                </div>
              )}
              <Editor
                height="100%"
                defaultLanguage={mode === 'code' ? 'javascript' : 'markdown'}
                value={mode === 'code' ? code : content}
                onChange={(value: any) =>
                  mode === 'code' ? setCode(value || '') : setContent(value || '')
                }
                onMount={() => setIsEditorReady(true)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  tabSize: 2,
                  automaticLayout: true,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                }}
                theme="vs-light"
                language={mode === 'code' ? 'javascript' : 'markdown'}
              />
            </div>
          </div>

          {/* 预览区域 */}
          <div className="w-1/2 flex flex-col">
            <div className="p-2 border-b flex items-center">
              <span className="text-xs text-gray-500 font-medium">预览结果</span>
              <button
                type="button"
                onClick={() => setKey((prev) => prev + 1)}
                className="ml-auto text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                刷新预览
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <Tabs defaultValue={mode} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="mdx">MDX渲染</TabsTrigger>
                  <TabsTrigger value="code">代码预览</TabsTrigger>
                </TabsList>
                <TabsContent value="mdx">
                  <MDXRenderer content={content} />
                </TabsContent>
                <TabsContent value="code">
                  <CodePreview code={code} language="jsx" title="React组件预览" />
                </TabsContent>
              </Tabs>
            </div>
            {error && (
              <div className="p-3 m-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm fade-in">
                <div className="font-medium mb-1 flex items-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  错误:
                </div>
                <pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded">{error}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
