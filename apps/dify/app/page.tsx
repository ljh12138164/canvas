'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code2, ExternalLink, MapPin, PenTool } from 'lucide-react';
import Link from 'next/link';

type FeatureCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  borderColor: string;
};

const FeatureCard = ({ card, index }: { card: FeatureCard; index: number }) => (
  <div className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
    <Link href={card.path} className="block h-full">
      <Card
        className={`overflow-hidden h-full border ${card.borderColor} transition-all hover:shadow-lg hover:-translate-y-2 duration-300`}
      >
        <CardHeader className={`p-6 ${card.color}`}>
          <div className="flex justify-between items-center">
            {card.icon}
            <div className="w-12 h-12 rounded-full bg-white/30 dark:bg-black/20 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl mt-4 font-bold">{card.title}</CardTitle>
          <CardDescription className="text-base">{card.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            点击卡片访问{card.title}页面，体验相关功能。
          </p>
        </CardContent>
      </Card>
    </Link>
  </div>
);

export default function HomePage() {
  const features: FeatureCard[] = [
    {
      id: 'code',
      title: '代码编译平台',
      description: '在线编辑和实时预览React组件',
      icon: <Code2 className="h-8 w-8 text-primary" />,
      path: '/code',
      color: 'bg-blue-100 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 'map',
      title: '可视化地图',
      description: '交互式地图展示与操作',
      icon: <MapPin className="h-8 w-8 text-amber-600" />,
      path: '/map',
      color: 'bg-amber-100 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      id: 'grap',
      title: '图表展示',
      description: '数据可视化与图表工具',
      icon: <PenTool className="h-8 w-8 text-purple-600" />,
      path: '/grap',
      color: 'bg-purple-100 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 opacity-70" />
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-0 animate-fade-in"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-0 animate-fade-in"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <header
          className="text-center mb-16 opacity-0 animate-fade-down"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            我的测试平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            个人测试平台，提供代码编译、图像生成、地图展示等多种功能
          </p>
          <div
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Button size="lg" className="rounded-full">
              开始探索
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              查看文档
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} card={feature} index={index} />
          ))}
        </div>

        <footer
          className="text-center mt-20 text-sm text-muted-foreground opacity-0 animate-fade-in"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <p>© {new Date().getFullYear()} 测试平台 - 版权所有</p>
        </footer>
      </div>
    </div>
  );
}
