'use client';

import { ThemedLivePreview } from '@/components/themed-live-preview';
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
import { LiveError, LiveProvider } from 'react-live';

const CodeExample1 = `
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
const CodeExample = `() => {
  const [tasks, setTasks] = React.useState([
    { id: 1, text: '学习 React', completed: true },
    { id: 2, text: '掌握 Shadcn UI', completed: false },
    { id: 3, text: '构建在线编译平台', completed: false }
  ]);
  const [newTask, setNewTask] = React.useState('');
  
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now(), 
        text: newTask, 
        completed: false 
      }]);
      setNewTask('');
    }
  };
  
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>待办事项列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none"
            placeholder="添加新任务..."
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} className="rounded-l-none">
            添加
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mr-3 h-4 w-4"
                />
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.text}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                删除
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="outline">
          {tasks.filter(t => t.completed).length}/{tasks.length} 已完成
        </Badge>
      </CardFooter>
    </Card>
  );
}`.trim();
const CodeExample2 = `() => {
  const [count, setCount] = React.useState(0);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  return (
    <Card className={isDarkMode ? "bg-slate-900 text-white border-slate-700" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>计数器示例</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-mode" className="text-sm">
              {isDarkMode ? "深色" : "浅色"}
            </Label>
            <Switch 
              id="theme-mode" 
              checked={isDarkMode} 
              onCheckedChange={() => setIsDarkMode(!isDarkMode)} 
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={isDarkMode ? "outline" : "default"}>
            当前计数: {count}
          </Badge>
          {count > 5 && (
            <Badge variant="destructive">
              数值较高
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="default"
          onClick={() => setCount(count + 1)}
        >
          增加
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setCount(0)}
        >
          重置
        </Button>
      </CardFooter>
    </Card>
  );
}
`.trim();
const CodeExample3 = `() => {

 const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

  const [activeChart, setActiveChart] =
    React.useState("desktop")

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key 
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={\`var(--color-\${activeChart})\`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
`.trim();

export default function CodePlayground() {
  const [code, setCode] = useState(CodeExample3);
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
