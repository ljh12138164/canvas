import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Main from '../Main';

// 模拟next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
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
  default: ({ href, children, className }: any) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('Main组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup(); // 确保每个测试前清理DOM
    // 提供默认的useUsers模拟返回值
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });
  });

  it('应该正确渲染主页内容', () => {
    render(<Main />);

    // 验证标题和描述文本是否存在
    expect(screen.getByText('释放创意，')).toBeInTheDocument();
    expect(screen.getByText('设计未来')).toBeInTheDocument();
    expect(screen.getByText('简单易用的在线设计工具，让创意更轻松地实现')).toBeInTheDocument();

    // 验证按钮是否存在
    expect(screen.getByText('前往工作区')).toBeInTheDocument();
    expect(screen.getByText('浏览作品')).toBeInTheDocument();

    // 验证特性部分是否渲染
    expect(screen.getByText('简单易用')).toBeInTheDocument();
    expect(screen.getByText('模板丰富')).toBeInTheDocument();
    expect(screen.getByText('素材丰富')).toBeInTheDocument();
    expect(screen.getByText('论坛中心')).toBeInTheDocument();
  });

  it('未登录状态下点击"前往工作区"按钮应跳转到登录页面', () => {
    render(<Main />);

    // 点击"前往工作区"按钮
    const button = screen.getByText('前往工作区');
    fireEvent.click(button);

    // 应该跳转到登录页面
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('已登录状态下点击"前往工作区"按钮应跳转到工作区', () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Main />);

    // 点击"前往工作区"按钮
    const button = screen.getByText('前往工作区');
    fireEvent.click(button);

    // 应该跳转到工作区
    expect(mockPush).toHaveBeenCalledWith('/board');
  });

  it('加载状态下"前往工作区"按钮应该被禁用', () => {
    // 模拟加载状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Main />);

    // 前往工作区按钮应该被禁用
    const button = screen.getByText('前往工作区');
    expect(button).toBeDisabled();
  });

  it('未登录状态下浏览作品链接应指向登录页面', () => {
    // 测试未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Main />);

    // 未登录状态下，浏览作品链接应指向登录页面
    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('已登录状态下浏览作品链接应指向作品页面', () => {
    // 测试已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Main />);

    // 已登录状态下，浏览作品链接应指向作品页面
    const loggedInLink = screen.getByTestId('next-link');
    expect(loggedInLink).toHaveAttribute('href', '/board/formue');
  });

  it('已登录状态下"浏览作品"按钮不应被禁用', () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Main />);

    // "浏览作品"按钮不应被禁用
    const button = screen.getByText('浏览作品');
    expect(button).not.toBeDisabled();
  });

  it('未登录状态下"浏览作品"按钮应被禁用', () => {
    render(<Main />);

    // 未登录状态下，"浏览作品"按钮应被禁用
    const button = screen.getByText('浏览作品');
    expect(button).toBeDisabled();
  });
});
