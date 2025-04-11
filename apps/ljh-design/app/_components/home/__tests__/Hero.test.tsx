import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from '../Hero';

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

// 模拟Link组件
vi.mock('next/link', () => ({
  default: ({ href, children }: any) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

// 模拟useUsers返回值
import useUsers from '@/app/_hook/useUser';

describe('Hero组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup(); // 确保每个测试之前清理DOM
  });

  it('未登录状态下应该正确渲染', async () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 验证标题和描述是否存在
    expect(screen.getByText('释放创意，')).toBeInTheDocument();
    expect(screen.getByText('设计无限可能')).toBeInTheDocument();
    expect(
      screen.getByText('简单易用的在线设计工具，让您轻松创建精美设计，无需专业技能，即刻开始创作'),
    ).toBeInTheDocument();

    // 验证按钮是否存在
    expect(screen.getByText('开始设计')).toBeInTheDocument();
    expect(screen.getByText('浏览模板')).toBeInTheDocument();

    // 验证特性标签是否存在
    expect(screen.getByText('AI辅助设计')).toBeInTheDocument();
    expect(screen.getByText('海量模板')).toBeInTheDocument();
    expect(screen.getByText('丰富素材')).toBeInTheDocument();
    expect(screen.getByText('一键分享')).toBeInTheDocument();
  });

  it('已登录状态下应该正确渲染', async () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 验证标题和描述是否存在
    expect(screen.getByText('释放创意，')).toBeInTheDocument();
    expect(screen.getByText('设计无限可能')).toBeInTheDocument();

    // 按钮应该存在
    expect(screen.getByText('开始设计')).toBeInTheDocument();
    expect(screen.getByText('浏览模板')).toBeInTheDocument();
  });

  it('加载状态下按钮应该被禁用', async () => {
    // 模拟加载状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: true,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 开始设计按钮应该被禁用
    const startButton = screen.getByText('开始设计');
    expect(startButton).toBeDisabled();
  });

  it('未登录状态下点击"开始设计"按钮应跳转到登录页面', async () => {
    // 模拟未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 点击"开始设计"按钮
    const startButton = screen.getByText('开始设计');
    fireEvent.click(startButton);

    // 应该跳转到登录页面
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('已登录状态下点击"开始设计"按钮应跳转到工作区', async () => {
    // 模拟已登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 点击"开始设计"按钮
    const startButton = screen.getByText('开始设计');
    fireEvent.click(startButton);

    // 应该跳转到工作区
    expect(mockPush).toHaveBeenCalledWith('/board');
  });

  it('浏览模板链接的href应根据登录状态变化', () => {
    // 分别测试未登录和已登录状态，不在同一个测试中进行
    // 未登录状态
    vi.mocked(useUsers).mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    const { unmount } = render(<Hero />);

    // 未登录状态下，浏览模板链接应指向登录页面
    const templateLink = screen.getByTestId('next-link');
    expect(templateLink).toHaveAttribute('href', '/sign-in');

    // 清除渲染
    unmount();

    // 已登录状态
    vi.clearAllMocks();
    vi.mocked(useUsers).mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      loading: false,
      setUser: vi.fn(),
      setLoading: vi.fn(),
    });

    render(<Hero />);

    // 已登录状态下，浏览模板链接应指向模板页面
    const templateLinkLoggedIn = screen.getByTestId('next-link');
    expect(templateLinkLoggedIn).toHaveAttribute('href', '/board/template');
  });
});
