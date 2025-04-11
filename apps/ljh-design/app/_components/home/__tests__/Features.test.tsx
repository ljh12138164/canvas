import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Features from '../Features';

// 模拟Card等组件
vi.mock('@/app/_components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children, className }: any) => (
    <div data-testid="card-description" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
}));

// 模拟utils
vi.mock('@/app/_lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Features组件', () => {
  it('应该正确渲染标题和描述', () => {
    render(<Features />);

    // 验证标题和描述
    expect(screen.getByText('强大功能，简单操作')).toBeInTheDocument();
    expect(
      screen.getByText('我们提供一系列强大而易用的功能，帮助您轻松创建专业级设计作品'),
    ).toBeInTheDocument();
  });

  it('应该渲染所有功能卡片', () => {
    render(<Features />);

    // 验证所有功能标题是否存在
    expect(screen.getByText('直观设计')).toBeInTheDocument();
    expect(screen.getByText('丰富模板')).toBeInTheDocument();
    expect(screen.getByText('素材库')).toBeInTheDocument();
    expect(screen.getByText('AI辅助')).toBeInTheDocument();
    expect(screen.getByText('一键分享')).toBeInTheDocument();

    // 验证所有功能描述是否存在
    expect(screen.getByText('拖拽式界面，所见即所得，让设计过程变得简单直观')).toBeInTheDocument();
    expect(
      screen.getByText('数千种精美模板，涵盖社交媒体、演示文稿、海报等多种场景'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('海量高质量图片、图标、插图和字体，满足各种设计需求'),
    ).toBeInTheDocument();
    expect(screen.getByText('智能生成设计元素，自动调整布局，提升设计效率')).toBeInTheDocument();
    expect(
      screen.getByText('轻松导出多种格式，一键分享到社交媒体或下载高清文件'),
    ).toBeInTheDocument();

    // 验证图标是否存在
    expect(screen.getByText('✏️')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
    expect(screen.getByText('🖼️')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });
});
