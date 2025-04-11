import { useBoardDeleteQuery, useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import { useTemplate, useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { useQueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TemplateMain from '../TemplateMain';

// 模拟依赖
vi.mock('@/app/_hook/query/useTemaplate', () => ({
  useTemplate: vi.fn(),
  useUserTemplate: vi.fn(),
}));

vi.mock('@/app/_hook/query/useBoardQuery', () => ({
  useBoardQuery: vi.fn(),
  useBoardDeleteQuery: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, fill, priority, quality, className }: any) => (
    <img
      src={src}
      alt={alt}
      data-fill={fill}
      data-priority={priority}
      data-quality={quality}
      className={className}
    />
  ),
}));

vi.mock('react-photo-view', () => ({
  PhotoProvider: ({ children }: any) => <div data-testid="photo-provider">{children}</div>,
  PhotoView: ({ src, children }: any) => (
    <div data-testid="photo-view" data-src={src}>
      {children}
    </div>
  ),
}));

// 模拟UI组件
vi.mock('@/app/_components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className, type }: any) => (
    <button
      className={className}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      type={type}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

vi.mock('@/app/_components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => (
    <div data-testid="dialog-trigger" data-aschild={asChild}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogFooter: ({ children, className }: any) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid="dropdown-menu-trigger" data-aschild={asChild}>
      {children}
    </div>
  ),
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, asChild }: any) => (
    <div data-testid="dropdown-menu-item" data-aschild={asChild}>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: any) => (
    <div data-testid="scroll-area" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className} data-testid="skeleton" />,
}));

vi.mock('@/app/_components/Comand/ColorCard', () => ({
  default: ({ children, title, icon, className }: any) => (
    <div data-testid="color-card" className={className}>
      <div data-testid="card-icon">{icon}</div>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/Comand/Response', () => ({
  Response: ({
    children,
    title,
    description,
    variant,
    ref,
    myTrigger,
    onConfirm,
    showFooter,
  }: any) => {
    if (ref) {
      ref.current = {
        closeModel: vi.fn(),
      };
    }
    return (
      <div data-testid="response" data-variant={variant} data-show-footer={showFooter}>
        {myTrigger && <div data-testid="response-trigger">{myTrigger}</div>}
        <h3>{title}</h3>
        <p>{description}</p>
        <button type="button" data-testid="response-confirm" onClick={onConfirm}>
          确认
        </button>
        {children}
      </div>
    );
  },
}));

vi.mock('@/app/_components/Board/BoardCreateFrom', () => ({
  default: ({ children, type, isTemplate, userId, templateData, closeref }: any) => {
    if (closeref) {
      closeref.current = {
        closeModel: vi.fn(),
      };
    }
    return (
      <form
        data-testid="board-create-form"
        data-type={type}
        data-is-template={isTemplate}
        data-user-id={userId}
      >
        <div>模板数据: {templateData?.name || JSON.stringify(templateData)}</div>
        {children}
      </form>
    );
  },
}));

describe('TemplateMain 组件', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  const mockBoardMutate = vi.fn();
  const mockDeleteBoard = vi.fn();

  const mockDefaultTemplates = [
    {
      id: '1',
      name: '默认模板1',
      description: '默认模板1描述',
      image: '/template1.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      sort: 1,
    },
    {
      id: '2',
      name: '默认模板2',
      description: '默认模板2描述',
      image: '/template2.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      sort: 2,
    },
  ];

  const mockUserTemplates = [
    {
      id: '3',
      name: '用户模板1',
      image: '/user-template1.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      height: 800,
      width: 600,
      userId: 'test-user',
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    // 设置 mock 返回值
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as any);

    vi.mocked(useBoardQuery).mockReturnValue({
      mutate: mockBoardMutate,
      isPending: false,
    } as any);

    vi.mocked(useBoardDeleteQuery).mockReturnValue({
      mutate: mockDeleteBoard,
      isPending: false,
    } as any);

    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: mockDefaultTemplates,
      isLoadingDefault: false,
      errorDefault: null,
    });

    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: mockUserTemplates,
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });
  });

  it('应该正确渲染组件并显示默认模板和用户模板', () => {
    render(<TemplateMain userId="test-user" />);

    // 检查是否调用了 invalidateQueries
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['templateUser'] });

    // 检查标题
    expect(screen.getByText('默认模板', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('我的模板', { selector: 'h1' })).toBeInTheDocument();

    // 检查默认模板 - 使用更精确的选择器
    expect(
      screen.getByText('默认模板1', { selector: '.text-lg.font-semibold' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('默认模板2', { selector: '.text-lg.font-semibold' }),
    ).toBeInTheDocument();
    expect(screen.getByText('默认模板1描述')).toBeInTheDocument();

    // 检查用户模板
    expect(
      screen.getByText('用户模板1', { selector: '.text-lg.font-semibold' }),
    ).toBeInTheDocument();
  });

  it('在加载中状态下应显示骨架屏', () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: undefined,
      isLoadingDefault: true,
      errorDefault: null,
    });

    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: undefined,
      isLoadingUserTemplate: true,
      errorUserTemplate: null,
    });

    render(<TemplateMain userId="test-user" />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(8); // 默认模板和用户模板各4个骨架屏
  });

  it('当没有用户模板时应显示提示信息', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: [],
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    render(<TemplateMain userId="test-user" />);

    expect(screen.getByText('你还没有设置模板')).toBeInTheDocument();
  });

  it('点击编辑按钮应跳转到编辑页面', () => {
    render(<TemplateMain userId="test-user" />);

    // 找到所有编辑按钮并点击第一个
    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    // 验证路由跳转
    expect(mockRouter.push).toHaveBeenCalledWith(`/EditTemplate/${mockUserTemplates[0].id}`);
  });

  it('点击删除按钮应调用deleteBoard', async () => {
    render(<TemplateMain userId="test-user" />);

    // 找到所有删除按钮并点击第一个
    const deleteButtons = screen.getAllByText('删除');
    fireEvent.click(deleteButtons[0]);

    // 找到确认按钮并点击 - 使用getAllByTestId然后选择相关的那个
    const confirmButtons = screen.getAllByTestId('response-confirm');
    // 由于删除确认模态框是最后一个添加到DOM的，所以应该是数组中的最后一个元素
    const deleteConfirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(deleteConfirmButton);

    // 验证删除调用
    expect(mockDeleteBoard).toHaveBeenCalledWith(
      { json: { id: mockUserTemplates[0].id, image: mockUserTemplates[0].image } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });
});
