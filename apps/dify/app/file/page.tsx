'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, getShadcnUiScope } from '@/lib/utils';
import { Editor } from '@monaco-editor/react';
import {
  ChevronDown,
  ChevronRight,
  Code,
  File,
  FileText,
  Folder,
  FolderOpen,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useMemo, useState } from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';

interface FileItem {
  id: string;
  type: 'file';
  code: string;
  path: string;
  name: string;
  language: string;
}
interface FileList {
  name: string;
  id: string;
  type: 'folder';
  children?: (FileList | FileItem)[];
  expanded?: boolean;
}

const CodeExample1 = `
function App() => {
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
const CodeExample = `
function App2() => {
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
const CodeExample2 = `function App3() => {
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
const CodeExample3 = `function App4() => {

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

// 数据结构
const sampleFiles: (FileList | FileItem)[] = [
  {
    name: 'app',
    id: 'app',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'dashboard',
        id: 'app/dashboard',
        type: 'folder',
        expanded: true,
        children: [
          {
            name: 'page.tsx',
            id: 'app/dashboard/page.tsx',
            type: 'file',
            language: 'tsx',
            path: 'app/dashboard/page.tsx',
            code: CodeExample1,
          },
        ],
      },
      {
        name: 'components',
        type: 'folder',
        id: 'app/components',
        expanded: true,
        children: [
          {
            name: 'app-sidebar.tsx',
            id: 'app/components/app-sidebar.tsx',
            type: 'file',
            language: 'tsx',
            code: CodeExample2,
            path: 'app/components/app-sidebar.tsx',
          },
          {
            name: 'search-form.tsx',
            id: 'app/components/search-form.tsx',
            type: 'file',
            language: 'tsx',
            code: CodeExample3,
            path: 'app/components/search-form.tsx',
          },
        ],
      },
    ],
  },
  {
    name: 'app2',
    id: 'app2',
    type: 'file',
    language: 'tsx',
    code: CodeExample,
    path: 'app2',
  },
];

// 自定义主题定义 - 实现截图中的代码颜色
const customTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'operator', foreground: 'D4D4D4' },

    // 添加特定语言的高亮规则
    { token: 'type', foreground: '4EC9B0' },
    { token: 'interface', foreground: '4EC9B0' },
    { token: 'class', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'parameter', foreground: '9CDCFE' },
    { token: 'property', foreground: '9CDCFE' },

    // JSX/TSX 特定规则
    { token: 'tag', foreground: '569CD6' },
    { token: 'tag.id', foreground: '569CD6' },
    { token: 'delimiter.angle', foreground: '808080' }, // < > 符号
    { token: 'delimiter.bracket', foreground: 'D4D4D4' }, // { } 符号
    { token: 'attribute.name', foreground: '9CDCFE' }, // JSX 属性名
    { token: 'attribute.value', foreground: 'CE9178' }, // JSX 属性值
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2D2D30',
    'editor.selectionBackground': '#264F78',
    'editorCursor.foreground': '#AEAFAD',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editor.findMatchBackground': '#515C6A',
    'editor.findMatchHighlightBackground': '#3A3D41',
  },
};

export default function FilePage() {
  const [activeFile, setActiveFile] = useState<string | null>('app');
  const [sidebarWidth] = useState(20); // 百分比
  const [consoleHeight] = useState(30); // 百分比
  const [showConsole, setShowConsole] = useState(true);
  const [fileStructure, setFileStructure] = useState(sampleFiles);
  const [previewKey, setPreviewKey] = useState(0);

  // 修复主题切换功能
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // 切换主题的函数 - 修复版本
  const toggleTheme = useCallback(() => {
    // 直接设置相反的主题，而不是基于当前主题判断
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // 添加新状态用于文件/文件夹创建弹窗
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // 添加状态来跟踪编辑器是否已加载
  const [editorLoaded, setEditorLoaded] = useState(false);

  // 添加编辑器加载完成的处理函数
  const handleEditorDidMount = useCallback(() => {
    setEditorLoaded(true);
  }, []);

  const toggleFolder = (path: string[], index: number) => {
    const newFileStructure = [...fileStructure];
    let current: (FileList | FileItem)[] = newFileStructure;

    // 导航到正确的嵌套级别
    for (const p of path) {
      const found = current.find((item) => item.name === p);
      if (found?.type === 'folder' && found?.children) {
        current = found.children;
      }
    }

    // 切换展开状态
    if (current[index].type === 'folder') {
      current[index].expanded = !current[index].expanded;
    }

    setFileStructure(newFileStructure);
  };
  const findPath = useMemo(() => {
    if (!activeFile) return null;

    // 处理直接在根目录的文件
    if (!activeFile.includes('/')) {
      const rootFile = fileStructure.find((item) => item.id === activeFile);
      if (rootFile?.type === 'file') return rootFile as FileItem;
      return null;
    }

    const pathParts = activeFile.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const dirPath = pathParts.slice(0, -1);

    let current: (FileList | FileItem)[] = fileStructure;

    // 导航到正确的文件夹
    for (const part of dirPath) {
      const folder = current.find(
        (item) => item.name === part && item.type === 'folder',
      ) as FileList;
      if (!folder || !folder.children) return null;
      current = folder.children;
    }

    // 查找文件
    const file = current.find((item) => item.name === fileName && item.type === 'file');
    return file?.type === 'file' ? (file as FileItem) : null;
  }, [activeFile, fileStructure]);

  // 打开创建文件/文件夹弹窗
  const openCreateDialog = (type: 'file' | 'folder', path: string[] = []) => {
    setCreateType(type);
    setNewItemName('');
    setCurrentPath(path);
    setIsCreateDialogOpen(true);
  };

  // 创建新文件或文件夹
  const handleCreateItem = () => {
    if (!newItemName.trim()) return;

    const newFileStructure = [...fileStructure];
    let current: (FileList | FileItem)[] = newFileStructure;

    // 导航到正确的嵌套级别
    for (const p of currentPath) {
      const found = current.find((item) => item.name === p);
      if (found?.type === 'folder' && found?.children) {
        current = found.children;
      }
    }

    // 确保文件名以.tsx结尾
    const fileName =
      createType === 'file'
        ? newItemName.endsWith('.tsx')
          ? newItemName
          : `${newItemName}.tsx`
        : newItemName;

    // 生成路径ID - 这是关键修改
    const pathParts = [...currentPath];
    if (createType === 'file') {
      pathParts.push(fileName);
    } else {
      pathParts.push(newItemName);
    }
    const newId = pathParts.join('/');

    // 创建新项目
    if (createType === 'file') {
      const newFile: FileItem = {
        id: newId,
        type: 'file',
        name: fileName,
        path: newId,
        language: 'tsx', // 固定为tsx
        code: '',
      };
      current.push(newFile);
      setActiveFile(newId);
    } else {
      const newFolder: FileList = {
        id: newId,
        type: 'folder',
        name: newItemName,
        expanded: true,
        children: [],
      };
      current.push(newFolder);
    }

    setFileStructure(newFileStructure);
    setIsCreateDialogOpen(false);
  };

  // 渲染文件树
  const renderFileTree = (items: (FileItem | FileList)[], path: string[] = []) => {
    return (
      <>
        {items.map((item, index) => (
          <div key={item.name} className="pl-4">
            <div
              className={cn(
                'flex items-center py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer',
                activeFile === item.id && ' dark:bg-gray-800 bg-gray-200',
              )}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(path, index);
                } else if (item.id) {
                  setActiveFile(item.id);
                }
              }}
            >
              {item.type === 'folder' ? (
                <>
                  {item.expanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                  )}
                  {item.expanded ? (
                    <FolderOpen className="h-4 w-4 mr-2 text-blue-400" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2 text-blue-400" />
                  )}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                </>
              )}
              <span>{item.name}</span>
              {item.type === 'file' && (
                <span className="ml-2 text-xs text-gray-500">
                  L{item.code?.split('\n').length || 1}
                </span>
              )}
            </div>
            {item.type === 'folder' && item.expanded && item.children && (
              <div>{renderFileTree(item.children, [...path, item.name])}</div>
            )}
          </div>
        ))}
      </>
    );
  };

  // 添加更新文件内容的函数
  const updateFileContent = useCallback(
    (newCode: string) => {
      if (!activeFile) return;

      setFileStructure((prevStructure) => {
        const newStructure = [...prevStructure];

        // 查找并更新活动文件的代码
        const updateFileInStructure = (items: (FileItem | FileList)[]) => {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.id === activeFile && item.type === 'file') {
              // 更新文件内容
              items[i] = { ...item, code: newCode };
              return true;
            }

            // 如果是文件夹，递归搜索
            if (item.type === 'folder' && item.children) {
              if (updateFileInStructure(item.children)) {
                return true;
              }
            }
          }
          return false;
        };

        updateFileInStructure(newStructure);
        return newStructure;
      });
    },
    [activeFile],
  );

  // 记录
  const genCode = useMemo(() => {
    const index = findPath?.code.indexOf(')');
    return `( ${findPath?.code.slice(index)}`;
  }, [findPath?.code]);

  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      updateFileContent(newValue || '');
      // 每次编辑器内容变化时，增加 previewKey 以强制更新预览
      setPreviewKey((prev) => prev + 1);
    },
    [updateFileContent],
  );

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-950 dark:text-gray-100">
      {/* 顶部工具栏 */}
      <div className="flex h-12 items-center justify-between border-b border-gray-800 px-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            文件
          </Button>
          <Button variant="ghost" size="sm">
            <Code className="mr-2 h-4 w-4" />
            编辑
          </Button>
        </div>

        {/* 主题切换按钮 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{isDarkTheme ? '深色' : '浅色'}主题</span>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 p-0">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">切换主题</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 使用ResizablePanelGroup替代Resizable */}
        <ResizablePanelGroup direction="horizontal">
          {/* 侧边栏 */}
          <ResizablePanel
            defaultSize={sidebarWidth}
            minSize={10}
            maxSize={40}
            className="border-r border-gray-800"
          >
            <div className="flex h-full flex-col">
              <div className="flex justify-between items-center p-2 text-sm font-medium border-b border-gray-800">
                <span>资源管理器</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => openCreateDialog('file')}
                  >
                    <File className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => openCreateDialog('folder')}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">{renderFileTree(fileStructure)}</ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* 主编辑区域 */}
          <ResizablePanel defaultSize={50 - sidebarWidth / 2}>
            <div className="flex h-full flex-col overflow-hidden">
              {/* 文件标签 */}
              <div className="flex h-9 items-center border-b border-gray-800 bg-gray-100 dark:bg-gray-900">
                <div className="flex h-full items-center border-r border-gray-800 px-3 text-sm">
                  <span className="text-blue-400">{findPath?.name}</span>
                  <Button variant="ghost" size="sm" className="ml-2 h-5 w-5 p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* 代码编辑器 */}
              <div className="relative h-full overflow-hidden">
                {findPath ? (
                  <Editor
                    height="calc(100vh - 57px)"
                    language={findPath.language}
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    value={findPath.code}
                    beforeMount={(monaco) => {
                      // 注册自定义主题
                      monaco.editor.defineTheme('customTheme', customTheme);

                      // 添加更多语言支持
                      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                        jsx: monaco.languages.typescript.JsxEmit.React,
                        jsxFactory: 'React.createElement',
                        reactNamespace: 'React',
                        allowNonTsExtensions: true,
                        allowJs: true,
                        target: monaco.languages.typescript.ScriptTarget.Latest,
                      });
                    }}
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      smoothScrolling: true,
                      folding: true,
                      foldingHighlight: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      tabSize: 2,
                      fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                      fontLigatures: true,
                      colorDecorators: true,
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true,
                      },
                    }}
                    loading={
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                          <p>加载编辑器中...</p>
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 opacity-20" />
                      <p className="mt-2">选择或创建一个文件以开始编辑</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* 预览区域 */}
          <ResizablePanel defaultSize={50 - sidebarWidth / 2}>
            <div className="flex h-full flex-col overflow-hidden">
              {/* 预览标签 */}
              <div className="flex h-9 items-center border-b border-gray-800 bg-gray-100 dark:bg-gray-900">
                <div className="flex h-full items-center px-3 text-sm">
                  <span className="text-gray-400">预览</span>
                </div>
              </div>

              {/* 预览内容 */}
              <div className="flex h-[calc(100%-36px)] flex-col overflow-auto  bg-gray-100 dark:bg-gray-900 p-4">
                <div className="w-full max-w-full flex-1 rounded-lg">
                  {findPath?.code ? (
                    <LiveProvider
                      key={previewKey}
                      code={genCode}
                      noInline={false}
                      scope={getShadcnUiScope()}
                    >
                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[200px]">
                        <LivePreview />
                      </div>
                      <div className="mt-4 text-red-500 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                        <LiveError />
                      </div>
                    </LiveProvider>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Code className="mx-auto h-12 w-12 opacity-20" />
                        <p className="mt-2">选择一个文件以预览结果</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* 创建文件/文件夹弹窗 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>创建{createType === 'file' ? '文件' : '文件夹'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup
              defaultValue={createType}
              onValueChange={(value) => setCreateType(value as 'file' | 'folder')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  文件
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="folder" id="folder" />
                <Label htmlFor="folder" className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  文件夹
                </Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-700"
                placeholder={createType === 'file' ? 'example.tsx' : 'example'}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">
                路径
              </Label>
              <div className="col-span-3 bg-gray-800 border border-gray-700 rounded-md p-2 text-sm">
                {currentPath.length > 0 ? `/${currentPath.join('/')}` : '/'}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateItem}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
