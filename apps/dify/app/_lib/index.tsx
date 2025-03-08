import { transform } from 'sucrase';
// import React from 'react';

export const CodeExample1 = `() => {
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
export const CodeExample = `() => {
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
export const CodeExample2 = `() => {
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
export const CodeExample3 = `() => {

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

// ${CodeExample}
// ${CodeExample1}
// ${CodeExample2}
// ${CodeExample3}
export const Codes = `
const Componet = () => {
  const [stata]=useState('q;asdasd')
  return (
    <>
      //  <CodeExample />
      //  <Separator className='my-2' />
      //  <CodeExample1 />
      //  <Separator className='my-2' />
      //  <CodeExample2 />
      //  <Separator className='my-2' />
      //  <CodeExample3 />
    </>
  );
};
  export default Componet
`.trim();
export const CodesError = `
// 这是一个包含多个错误的组件示例
const ErrorComponent = () => {
返回无效的 JSX
  return (
    <div>
      <div>
        <p>
          <div>错误导入</div>
        </p>
      </div>
    </div>
  );
};
export default ErrorComponent
`.trim();
/**
 * ### 将代码转换为 React 组件
 * @param code
 * @returns
 */
export const transformCode = (
  code: string,
  customComponentsName?: string[],
): Promise<{
  code: string;
  componentName: string;
  imports: string[];
  noImport: Record<string, string>;
}> => {
  return new Promise((res, rej) => {
    try {
      const importMatches = code.match(/import\s+.*?from\s+['"].*?['"]/g) || [];
      const imports = importMatches;
      const importNames = importMatches.reduce(
        (acc, importStr) => {
          // 处理默认导入
          const defaultMatch = importStr.match(/import\s+(\w+)\s+from/);
          if (defaultMatch) {
            acc[defaultMatch[1]] = importStr;
            return acc;
          }

          // 处理解构导入
          const destructureMatch = importStr.match(/import\s*{\s*(.*?)\s*}\s*from/);
          if (destructureMatch) {
            destructureMatch[1].split(',').forEach((name) => {
              acc[name.trim()] = importStr;
            });
            return acc;
          }

          // 处理全部导入
          const namespaceMatch = importStr.match(/import\s*\*\s*as\s+(\w+)\s+from/);
          if (namespaceMatch) {
            acc[namespaceMatch[1]] = importStr;
            return acc;
          }

          return acc;
        },
        {} as Record<string, string>,
      );
      const noImport: Record<string, string> = {};
      Object.keys(importNames).forEach((item) => {
        if (!customComponentsName?.find((items) => items === item))
          noImport[item] = importNames[item];
      });
      // 移除所有导入语句
      const codeWithoutImports = code.replace(/import\s+.*?from\s+['"].*?['"]/g, '').trim();

      // 提取导出的组件名
      const exportMatch = code.match(/export\s+default\s+(\w+)/);
      const componentName = exportMatch ? exportMatch[1] : '';
      // 移除 export default 语句
      const processedCode = codeWithoutImports.replace(/export\s+default\s+\w+/, '');
      if (Object.keys(noImport).length) throw new Error('缺少导入文件');
      const { code: transformedCode } = transform(processedCode, {
        transforms: ['typescript', 'jsx', 'imports'],
        jsxImportSource: 'react',
      });

      res({
        code: transformedCode,
        componentName,
        imports,
        noImport,
      });
    } catch (error) {
      rej(error);
    }
  });
};
