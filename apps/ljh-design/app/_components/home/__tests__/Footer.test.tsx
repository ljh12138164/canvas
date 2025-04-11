import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '../Footer';

// 模拟LogoWithText组件
vi.mock('@/app/_components/ui/Logo', () => ({
  LogoWithText: () => <div data-testid="logo-with-text">Logo测试</div>,
}));

describe('Footer组件', () => {
  it('应该正确渲染页脚内容', () => {
    render(<Footer />);

    // 验证Logo是否渲染
    expect(screen.getByTestId('logo-with-text')).toBeInTheDocument();

    // 验证描述文本是否存在
    expect(
      screen.getByText(
        '释放创意，设计未来。ljh-design是一款简单易用的在线设计工具，帮助您轻松创建精美设计。',
      ),
    ).toBeInTheDocument();

    // 验证版权信息是否包含当前年份
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} ljh-design. 保留所有权利。`)).toBeInTheDocument();
  });
});
