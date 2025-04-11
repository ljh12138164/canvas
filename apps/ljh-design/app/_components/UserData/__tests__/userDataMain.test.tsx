import useUser from '@/app/_hook/useUser';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserDataMain from '../userDataMain';

// Mock hooks
vi.mock('@/app/_hook/useUser', () => ({
  default: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock DataShow 组件
vi.mock('../DataShow', () => ({
  default: () => <div data-testid="data-show">DataShow Component</div>,
}));

// Mock UI 组件
vi.mock('@/app/_components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => (
    <div data-testid="scroll-area" className={className}>
      {children}
    </div>
  ),
}));

describe('UserDataMain', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('加载状态下渲染空内容', () => {
    (useUser as any).mockReturnValue({
      user: null,
      loading: true,
    });

    render(<UserDataMain />);

    // 不应该显示 DataShow 组件
    expect(screen.queryByTestId('data-show')).not.toBeInTheDocument();
    // 不应该显示 ScrollArea 组件
    expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
  });

  it('无用户时重定向到登录页', () => {
    (useUser as any).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<UserDataMain />);

    // 应该重定向到登录页
    expect(mockRouter.push).toHaveBeenCalledWith('/sign-in');
  });

  it('有用户时渲染 DataShow 组件', () => {
    (useUser as any).mockReturnValue({
      user: { id: 'user-123' },
      loading: false,
    });

    render(<UserDataMain />);

    // 应该渲染 ScrollArea 组件
    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea).toHaveClass('h-full');
    expect(scrollArea).toHaveClass('w-full');

    // 应该渲染 DataShow 组件
    expect(screen.getByTestId('data-show')).toBeInTheDocument();
  });
});
