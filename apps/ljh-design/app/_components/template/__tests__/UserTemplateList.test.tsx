import { useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserTemplateList from '../UserTemplateList';

// 模拟 Supabase
vi.mock('@/app/_database/supabase', () => ({
  default: {
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: { Key: 'test-key' } }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } }),
      }),
    },
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  },
}));

// 模拟依赖
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}));

vi.mock('@/app/_hook/query/useTemaplate', () => ({
  useUserTemplate: vi.fn(),
}));

vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className} data-testid="skeleton" />,
}));

// 模拟 Response 组件
let responseCloseModelMock: jest.Mock | null = null;

vi.mock('@/app/_components/Comand/Response', () => ({
  Response: ({ myTrigger, title, onConfirm, children, ref }: any) => {
    if (ref) {
      responseCloseModelMock = vi.fn();
      ref.current = {
        closeModel: responseCloseModelMock,
      };
    }
    return (
      <div>
        <div>{myTrigger}</div>
        <h3>{title}</h3>
        <button type="button" data-testid="confirm-button" onClick={onConfirm}>
          确认
        </button>
        {children}
      </div>
    );
  },
}));

// 模拟 myTrigger 函数，因为它是从 DefaultTemplateList 导入的
vi.mock('../DefaultTemplateList', () => ({
  myTrigger: (item: any) => (
    <div>
      <img src={item.image} alt={item.name} />
      <p>{item.name}</p>
    </div>
  ),
}));

describe('UserTemplateList 组件', () => {
  const mockEditor = {
    loadFromJson: vi.fn(),
  };

  const mockTemplates = [
    {
      id: '1',
      name: '用户模板1',
      image: '/user-template1.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      height: 800,
      width: 600,
      userId: 'test-user',
    },
    {
      id: '2',
      name: '用户模板2',
      image: '/user-template2.jpg',
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
    responseCloseModelMock = null;
  });

  it('在加载中状态下应显示骨架屏', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: undefined,
      isLoadingUserTemplate: true,
      errorUserTemplate: null,
    });

    render(<UserTemplateList editor={mockEditor as any} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(4);
  });

  it('当没有模板时应显示"暂无模板"信息', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: [],
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    render(<UserTemplateList editor={mockEditor as any} />);

    expect(screen.getByText('暂无模板')).toBeInTheDocument();
  });

  it('应正确渲染用户模板列表', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: mockTemplates,
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    render(<UserTemplateList editor={mockEditor as any} />);

    // 检查模板是否正确渲染
    expect(screen.getByText('用户模板1')).toBeInTheDocument();
    expect(screen.getByText('用户模板2')).toBeInTheDocument();
  });

  it('点击确认按钮时应加载模板并关闭模态框', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: mockTemplates,
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    // 模拟编辑器的 loadFromJson 方法
    mockEditor.loadFromJson = vi.fn().mockImplementation((json, callback) => {
      callback();
    });

    render(<UserTemplateList editor={mockEditor as any} />);

    // 点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('confirm-button');
    fireEvent.click(confirmButtons[0]);

    // 验证加载
    expect(mockEditor.loadFromJson).toHaveBeenCalledWith(
      mockTemplates[0].json,
      expect.any(Function),
    );
    // 验证模态框关闭方法被调用
    expect(responseCloseModelMock).toHaveBeenCalled();
  });

  it('当responseRef.current为null时也能正常处理', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: mockTemplates,
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    // 模拟编辑器的 loadFromJson 方法
    mockEditor.loadFromJson = vi.fn().mockImplementation((json, callback) => {
      callback();
    });

    // 手动设置responseCloseModelMock为null，模拟responseRef.current为null的情况
    responseCloseModelMock = null;

    render(<UserTemplateList editor={mockEditor as any} />);

    // 点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('confirm-button');
    fireEvent.click(confirmButtons[0]);

    // 验证loadFromJson被调用，即使responseRef.current为null也不会抛错
    expect(mockEditor.loadFromJson).toHaveBeenCalledWith(
      mockTemplates[0].json,
      expect.any(Function),
    );
  });

  it('当editor为undefined时也能正常处理', () => {
    vi.mocked(useUserTemplate).mockReturnValue({
      dataUserTemplate: mockTemplates,
      isLoadingUserTemplate: false,
      errorUserTemplate: null,
    });

    // 渲染时不传入editor
    render(<UserTemplateList editor={undefined} />);

    // 点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('confirm-button');
    fireEvent.click(confirmButtons[0]);

    // 不应该抛出错误，组件应该能够处理editor为undefined的情况
    // 这里我们只期望它不会抛错
  });
});
