import { fireEvent, render, screen } from '@testing-library/react';
// apps/ljh-design/app/_components/home/__tests__/CallToAction.test.tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CallToAction from '../CallToAction';

// 模拟next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

// 模拟Lucide-react图标
vi.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
}));

// 模拟useUser hook
vi.mock('@/app/_hook/useUser', () => ({
  default: vi.fn(),
}));

// 模拟Link组件
vi.mock('next/link', () => ({
  default: ({ href, children }: any) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

// 导入useUsers用于mock数据
import useUsers from '@/app/_hook/useUser';

describe('CallToAction组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未登录状态下应该显示注册和登录按钮', () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 验证标题和描述
    expect(screen.getByText('准备好开始您的设计之旅了吗？')).toBeInTheDocument();
    expect(
      screen.getByText('立即注册，免费体验ljh-design的强大功能，释放您的创意潜能'),
    ).toBeInTheDocument();

    // 验证按钮文本
    expect(screen.getByText('免费注册')).toBeInTheDocument();
    expect(screen.getByText('登录账号')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });

  it('已登录状态下应该只显示进入工作区按钮', () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 验证按钮文本
    expect(screen.getByText('进入工作区')).toBeInTheDocument();
    expect(screen.queryByText('登录账号')).not.toBeInTheDocument();
  });

  it('加载状态下按钮应该被禁用', () => {
    // 模拟加载状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 免费注册按钮应该被禁用
    const registerButton = screen.getByText('免费注册');
    expect(registerButton).toBeDisabled();
  });

  it('未登录状态下点击"免费注册"按钮应跳转到登录页面', () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 点击"免费注册"按钮
    const registerButton = screen.getByText('免费注册');
    fireEvent.click(registerButton);

    // 应该跳转到登录页面
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('已登录状态下点击"进入工作区"按钮应跳转到工作区', () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 点击"进入工作区"按钮
    const workspaceButton = screen.getByText('进入工作区');
    fireEvent.click(workspaceButton);

    // 应该跳转到工作区
    expect(mockPush).toHaveBeenCalledWith('/board');
  });

  it('未登录状态下"登录账号"链接应指向登录页面', () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<CallToAction />);

    // 验证登录链接指向登录页面
    const loginLink = screen.getByTestId('next-link');
    expect(loginLink).toHaveAttribute('href', '/sign-in');
  });

  it('组件布局在不同状态下应保持一致', () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    const { container: containerNotLoggedIn } = render(<CallToAction />);

    // 清除渲染
    vi.clearAllMocks();

    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    const { container: containerLoggedIn } = render(<CallToAction />);

    // 两种状态下都应该存在标题和描述
    expect(screen.getAllByText('准备好开始您的设计之旅了吗？').length).toBe(2);
    expect(
      screen.getAllByText('立即注册，免费体验ljh-design的强大功能，释放您的创意潜能').length,
    ).toBe(2);
  });
});
