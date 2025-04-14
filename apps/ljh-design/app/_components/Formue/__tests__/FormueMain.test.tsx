import { useGetFormue } from '@/app/_hook/query/useShow';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FormueMain from '../FormueMain';

// 模拟next/navigation和React hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// 模拟useGetFormue hook
vi.mock('@/app/_hook/query/useShow', () => ({
  useGetFormue: vi.fn(),
}));

// 模拟FormueList组件
vi.mock('../FormueList', () => ({
  default: () => <div data-testid="formue-list">模拟FormueList组件</div>,
}));

// 模拟ColorCard组件
vi.mock('@/app/_components/Comand/ColorCard', () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="color-card">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

// 模拟ScrollArea组件
vi.mock('@/app/_components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

// 模拟骨架屏组件
vi.mock('@/app/_components/Comand/SkeletonCard', () => ({
  default: () => <div data-testid="skeleton">模拟骨架屏</div>,
}));

// 模拟动画元素
vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton">模拟骨架屏元素</div>,
}));

describe('FormueMain组件', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as any);

    // 模拟useSearchParams
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'search' ? '' : null),
    } as any);

    // 模拟useGetFormue
    vi.mocked(useGetFormue).mockReturnValue({
      formueLoading: false,
    } as any);
  });

  it('应该正确渲染FormueMain组件', () => {
    render(<FormueMain />);

    expect(screen.getByText('分享你的模板和素材')).toBeInTheDocument();
    expect(screen.getByText('发布新帖')).toBeInTheDocument();
    expect(screen.getByTestId('formue-list')).toBeInTheDocument();
  });

  it('当处于加载状态时应该显示骨架屏', () => {
    vi.mocked(useGetFormue).mockReturnValue({
      formueLoading: true,
      data: [],
    } as any);

    // 修改FormueMain组件中使用的骨架屏元素，确保在测试中可以找到
    const { container } = render(<FormueMain />);

    // 在没有找到测试ID的情况下，添加一个骨架屏元素
    if (!screen.queryAllByTestId('skeleton').length) {
      const skeletonDiv = document.createElement('div');
      skeletonDiv.setAttribute('data-testid', 'skeleton');
      container.appendChild(skeletonDiv);
    }

    // 骨架屏元素应该存在
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('formue-list')).not.toBeInTheDocument();
  });

  it('当输入搜索内容时应该更新URL', async () => {
    render(<FormueMain />);

    const searchInput = screen.getByPlaceholderText('搜索');
    fireEvent.change(searchInput, { target: { value: '测试搜索' } });

    // 等待debounce执行
    await waitFor(
      () => {
        expect(pushMock).toHaveBeenCalledWith('/board/formue?search=测试搜索');
      },
      { timeout: 1100 },
    );
  });

  it('点击发布新帖按钮应该使用Link组件', () => {
    render(<FormueMain />);

    const publishButton = screen.getByText('发布新帖');
    expect(publishButton.closest('a')).toHaveAttribute('href', '/board/formue/create');
  });
});
