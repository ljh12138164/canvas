import { render, screen } from '@testing-library/react';
// apps/ljh-design/app/_components/home/__tests__/Navbar.test.tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '../Navbar';

// 模拟Logo组件
vi.mock('@/app/_components/ui/Logo', () => ({
  LogoWithText: () => <div data-testid="logo-with-text">Logo测试</div>,
}));

// 模拟ThemeToggle组件
vi.mock('@/app/_components/Comand/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">主题切换</div>,
}));

// 模拟UserButton组件
vi.mock('@/app/_components/Comand/UserButton', () => ({
  default: () => <div data-testid="user-button">用户按钮</div>,
}));

// 模拟Button组件
vi.mock('@/app/_components/ui/button', () => ({
  Button: ({ children, variant, className, ...props }: any) => (
    <button data-testid="button" data-variant={variant} className={className} {...props}>
      {children}
    </button>
  ),
}));

// 模拟Skeleton组件
vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className} role="status" />
  ),
}));

// 模拟next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// 模拟useUser hook
vi.mock('@/app/_hook/useUser', () => ({
  default: vi.fn(),
}));

// 导入useUsers用于模拟
import useUsers from '@/app/_hook/useUser';

// 模拟Link组件
vi.mock('next/link', () => ({
  default: ({ href, children }: any) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('Navbar组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未登录状态下应该正确渲染导航栏', () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Navbar />);

    // 验证Logo是否渲染
    expect(screen.getByTestId('logo-with-text')).toBeInTheDocument();

    // 验证主题切换按钮是否渲染
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

    // 验证登录按钮是否渲染
    expect(screen.getByText('登录')).toBeInTheDocument();

    // 用户按钮不应该渲染
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
  });

  it('已登录状态下应该显示用户按钮', () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Navbar />);

    // 验证用户按钮是否渲染
    expect(screen.getByTestId('user-button')).toBeInTheDocument();

    // 登录按钮不应该渲染
    expect(screen.queryByText('登录')).not.toBeInTheDocument();
  });

  it('加载状态下应该显示骨架屏', () => {
    // 模拟加载状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Navbar />);

    // 验证骨架屏组件
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
