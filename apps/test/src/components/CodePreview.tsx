import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  showPreview?: boolean;
  readOnly?: boolean;
}

export default function CodePreview({
  code,
  language = 'jsx',
  title = '代码预览',
  showPreview = true,
  readOnly = true,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<string>(showPreview ? 'preview' : 'code');
  const [editorContent, setEditorContent] = useState<string>(code);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    setEditorContent(code);
  }, [code]);

  // 尝试将代码转换为可执行的React组件
  const PreviewComponent = () => {
    try {
      // 这里我们使用一个简单的方法来展示预览
      // 在实际应用中，您可能需要使用更复杂的方法来安全地执行代码
      return (
        <div className="p-4 border rounded-md bg-background">
          <div className="preview-container">
            <div className="text-sm text-muted-foreground mb-2">预览结果将在这里显示</div>
            <div className="p-4 border rounded bg-white">
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
              <div dangerouslySetInnerHTML={{ __html: '<div>预览暂不可用，仅展示代码</div>' }} />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="p-4 border rounded-md bg-red-50 text-red-500">
          <p>渲染错误:</p>
          <pre className="text-xs mt-2 overflow-auto">
            {error instanceof Error ? error.message : '未知错误'}
          </pre>
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 px-5 py-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="h-10 bg-transparent p-0">
            {showPreview && (
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                预览
              </TabsTrigger>
            )}
            <TabsTrigger
              value="code"
              className="rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
            >
              代码
            </TabsTrigger>
          </TabsList>
        </div>
        {showPreview && (
          <TabsContent value="preview" className="p-0">
            <CardContent className="p-4">
              <PreviewComponent />
            </CardContent>
          </TabsContent>
        )}
        <TabsContent value="code" className="p-0">
          <CardContent className="p-0 overflow-auto">
            <div className="relative h-[400px]">
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
                language={language}
                value={editorContent}
                onChange={(value) => !readOnly && setEditorContent(value || '')}
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
                  readOnly,
                }}
                theme="vs-light"
              />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
