'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getShadcnUiScope } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { ChevronDown, Code2, Copy, Moon, Sun } from 'lucide-react';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { CodeExample, CodeExample1, CodeExample2, CodeExample3 } from './_lib';

export default function CodePlayground() {
  const [code, setCode] = useState(CodeExample3);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setTheme: setNextTheme } = useNextTheme();

  useEffect(() => {
    setIsMounted(true);

    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'vs-dark' : 'light');
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'vs-dark' ? 'light' : 'vs-dark';
    setTheme(newTheme);
    setNextTheme(newTheme === 'vs-dark' ? 'dark' : 'light');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  if (!isMounted) {
    return null; // 避免服务端渲染不匹配
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span>代码编译平台</span>
          </h1>
          <p className="text-muted-foreground mt-1">在线编辑和实时预览 React 组件</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'vs-dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                示例代码
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => loadExample(CodeExample1)}>
                基础组件示例
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => loadExample(CodeExample2)}>
                计数器示例
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => loadExample(CodeExample3)}>
                财务图表示例
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => loadExample(CodeExample)}>
                待办事项列表
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Separator className="mb-6" />

      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="ml-2">
            {theme === 'vs-dark' ? '深色主题' : '浅色主题'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            {copied ? '已复制' : '复制代码'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
        <Card className="h-[calc(100vh-240px)] overflow-hidden border-primary/20">
          <CardHeader className="bg-muted/50 py-3">
            <CardTitle className="text-base flex items-center">
              <Code2 className="h-4 w-4 mr-2" />
              代码编辑器
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-56px)]">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-240px)] overflow-hidden border-primary/20">
          <CardHeader className="bg-muted/50 py-3">
            <CardTitle className="text-base">预览结果</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-56px)]">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-2">
                <TabsTrigger value="preview">实时预览</TabsTrigger>
                <TabsTrigger value="error">错误信息</TabsTrigger>
              </TabsList>

              <div className="flex-grow overflow-auto p-4">
                <TabsContent value="preview" className="h-full mt-0 border rounded-md p-4">
                  <LiveProvider code={code} noInline={false} scope={getShadcnUiScope()}>
                    <LivePreview />
                  </LiveProvider>
                </TabsContent>

                <TabsContent
                  value="error"
                  className="h-full mt-0"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <LiveProvider code={code} noInline={false} scope={getShadcnUiScope()}>
                    <LiveError className="text-destructive p-4 font-mono text-sm" />
                  </LiveProvider>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-6 text-center text-sm text-muted-foreground">
        <p>使用 React、Monaco Editor 和 Shadcn UI 构建</p>
      </footer>
    </div>
  );
}
