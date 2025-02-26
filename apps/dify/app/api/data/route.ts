import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    code: `() => {
  const [count, setCount] = React.useState(0);
  
  // 使用 shadcn UI 组件
  const { Button } = require('@/components/ui/button');
  const { Card, CardContent, CardHeader, CardTitle, CardFooter } = require('@/components/ui/card');
  const { Badge } = require('@/components/ui/badge');
  const { Switch } = require('@/components/ui/switch');
  const { Label } = require('@/components/ui/label');
  
  // 模拟深色模式切换
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <Card className={isDarkMode ? "bg-slate-900 text-white border-slate-700" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Shadcn UI 示例</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-mode" className="text-sm">
              {isDarkMode ? "深色" : "浅色"}
            </Label>
            <Switch 
              id="theme-mode" 
              checked={isDarkMode} 
              onCheckedChange={toggleTheme} 
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
}`,
  });
}
