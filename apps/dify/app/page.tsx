'use client';

import Editor from '@monaco-editor/react';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LiveEditor, LiveError, LiveProvider } from 'react-live';

import { ThemeProvider } from '@/components/theme-provider';
import { ThemedLivePreview } from '@/components/themed-live-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Copy, Download, Moon, Share2, Sun } from 'lucide-react';

const defaultCode = `
() => {
  const [display, setDisplay] = React.useState('0');
  const [firstOperand, setFirstOperand] = React.useState(null);
  const [operator, setOperator] = React.useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = React.useState(false);
  
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };
  
  const buttonStyle = "h-12 flex items-center justify-center";
  
  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader>
        <CardTitle className="text-center">计算器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-2  rounded text-right text-2xl font-mono h-12">
          {display}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" className={buttonStyle} onClick={clearDisplay}>C</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => {}}>+/-</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => {}}>%</Button>
          <Button variant="default" className={buttonStyle} onClick={() => performOperation('/')}>÷</Button>
          
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('7')}>7</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('8')}>8</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('9')}>9</Button>
          <Button variant="default" className={buttonStyle} onClick={() => performOperation('*')}>×</Button>
          
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('4')}>4</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('5')}>5</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('6')}>6</Button>
          <Button variant="default" className={buttonStyle} onClick={() => performOperation('-')}>-</Button>
          
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('1')}>1</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('2')}>2</Button>
          <Button variant="outline" className={buttonStyle} onClick={() => inputDigit('3')}>3</Button>
          <Button variant="default" className={buttonStyle} onClick={() => performOperation('+')}>+</Button>
          
          <Button variant="outline" className={\`\${buttonStyle} col-span-2\`} onClick={() => inputDigit('0')}>0</Button>
          <Button variant="outline" className={buttonStyle} onClick={inputDecimal}>.</Button>
          <Button variant="default" className={buttonStyle} onClick={() => performOperation('=')}>=</Button>
        </div>
      </CardContent>
    </Card>
  );
}
`.trim();

export default function CodePlayground() {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  useEffect(() => {
    setIsMounted(true);

    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'vs-dark' : 'light');
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
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

  const fetchExampleCode = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      console.error('获取示例代码失败:', error);
    }
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
          <Button variant="outline" onClick={fetchExampleCode}>
            加载示例
          </Button>
        </div>
      </header>

      <Separator className="mb-6" />

      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="ml-2">
            {theme === 'vs-dark' ? '深色主题' : '浅色主题'}
          </Badge>
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
                  <LiveProvider
                    code={code}
                    noInline={false}
                    scope={{
                      Button,
                      Card,
                      CardContent,
                      CardHeader,
                      CardTitle,
                      CardFooter,
                      Badge,
                      Label: ({ htmlFor, className, children }) => (
                        <label htmlFor={htmlFor} className={`text-sm ${className || ''}`}>
                          {children}
                        </label>
                      ),
                      Switch: ({ checked, onCheckedChange, id }) => (
                        <button
                          id={id}
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
                          onClick={() => onCheckedChange(!checked)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`}
                          />
                        </button>
                      ),
                    }}
                  >
                    <div className={theme === 'vs-dark' ? 'dark' : ''}>
                      <div className="bg-background text-foreground rounded-md h-full">
                        <ThemedLivePreview />
                      </div>
                    </div>
                  </LiveProvider>
                </TabsContent>

                <TabsContent
                  value="error"
                  className="h-full mt-0"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <LiveProvider
                    code={code}
                    noInline={false}
                    scope={{
                      Button,
                      Card,
                      CardContent,
                      CardHeader,
                      CardTitle,
                      CardFooter,
                      Badge,
                      Label: ({ htmlFor, className, children }) => (
                        <label htmlFor={htmlFor} className={`text-sm ${className || ''}`}>
                          {children}
                        </label>
                      ),
                      Switch: ({ checked, onCheckedChange, id }) => (
                        <button
                          id={id}
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
                          onClick={() => onCheckedChange(!checked)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`}
                          />
                        </button>
                      ),
                    }}
                  >
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
