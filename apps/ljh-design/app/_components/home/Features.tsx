'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import { cn } from '@/app/_lib/utils';

const features = [
  {
    icon: '✏️',
    title: '直观设计',
    description: '拖拽式界面，所见即所得，让设计过程变得简单直观',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    icon: '🎨',
    title: '丰富模板',
    description: '数千种精美模板，涵盖社交媒体、演示文稿、海报等多种场景',
    color: 'bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  },
  {
    icon: '🖼️',
    title: '素材库',
    description: '海量高质量图片、图标、插图和字体，满足各种设计需求',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    icon: '🤖',
    title: 'AI辅助',
    description: '智能生成设计元素，自动调整布局，提升设计效率',
    color: 'bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  },
  {
    icon: '🚀',
    title: '一键分享',
    description: '轻松导出多种格式，一键分享到社交媒体或下载高清文件',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  },
];

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">强大功能，简单操作</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          我们提供一系列强大而易用的功能，帮助您轻松创建专业级设计作品
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              'transition-all duration-700 ease-out',
              // 添加延迟效果
              index % 3 === 0
                ? 'animate-fade-in'
                : index % 3 === 1
                  ? 'animate-fade-in animation-delay-150'
                  : 'animate-fade-in animation-delay-300',
            )}
          >
            <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-xl',
                    feature.color,
                  )}
                >
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
