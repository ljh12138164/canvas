'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Code2, FileText, Image, MapPin, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const pages = [
    {
      id: 'code',
      title: '代码编译平台',
      description: '在线编辑和实时预览React组件',
      icon: <Code2 className="h-8 w-8 text-primary" />,
      path: '/code',
      color: 'bg-blue-100 dark:bg-blue-950',
    },

    {
      id: 'map',
      title: '可视化地图',
      description: '交互式地图展示与操作',
      icon: <MapPin className="h-8 w-8 text-amber-600" />,
      path: '/map',
      color: 'bg-amber-100 dark:bg-amber-950',
    },
    {
      id: 'grap',
      title: '图表展示',
      description: '数据可视化与图表工具',
      icon: <PenTool className="h-8 w-8 text-purple-600" />,
      path: '/grap',
      color: 'bg-purple-100 dark:bg-purple-950',
    },
  ];

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">我的测试平台</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          个人测试平台，提供代码编译、图像生成、地图展示等多种功能
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card
            key={page.id}
            className="overflow-hidden border border-muted transition-all hover:shadow-md"
          >
            <CardHeader className={`p-6 ${page.color}`}>
              <div className="flex justify-between items-center">{page.icon}</div>
              <CardTitle className="text-2xl mt-4">{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                点击下方按钮访问{page.title}页面，体验相关功能。
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href={page.path} className="w-full">
                <Button variant="default" className="w-full group">
                  进入{page.title}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
