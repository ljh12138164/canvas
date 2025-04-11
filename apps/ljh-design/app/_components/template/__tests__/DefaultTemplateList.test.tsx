import { useTemplate } from '@/app/_hook/query/useTemaplate';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DefaultTemplateList, { myTrigger } from '../DefaultTemplateList';

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
  useTemplate: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(),
    dismiss: vi.fn(),
    success: vi.fn(),
  },
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

describe('DefaultTemplateList 组件', () => {
  const mockEditor = {
    loadFromJson: vi.fn(),
  };

  const mockTemplates = [
    {
      id: '1',
      name: '模板1',
      description: '默认模板1描述',
      image: '/template1.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      sort: 1,
    },
    {
      id: '2',
      name: '模板2',
      description: '默认模板2描述',
      image: '/template2.jpg',
      json: '{"version":"5.3.0","objects":[]}',
      sort: 2,
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    responseCloseModelMock = null;
  });

  it('在加载中状态下应显示骨架屏', () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: undefined,
      isLoadingDefault: true,
      errorDefault: null,
    });

    render(<DefaultTemplateList editor={mockEditor as any} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(4);
  });

  it('当没有模板时应显示"暂无模板"信息', () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: [],
      isLoadingDefault: false,
      errorDefault: null,
    });

    render(<DefaultTemplateList editor={mockEditor as any} />);

    expect(screen.getByText('暂无模板')).toBeInTheDocument();
  });

  it('应正确渲染模板列表', () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: mockTemplates,
      isLoadingDefault: false,
      errorDefault: null,
    });

    render(<DefaultTemplateList editor={mockEditor as any} />);

    // 检查模板是否正确渲染
    expect(screen.getByText('模板1')).toBeInTheDocument();
    expect(screen.getByText('模板2')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/template1.jpg');
    expect(images[1]).toHaveAttribute('src', '/template2.jpg');
  });

  it('点击确认按钮时应加载模板并关闭模态框', async () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: mockTemplates,
      isLoadingDefault: false,
      errorDefault: null,
    });

    mockEditor.loadFromJson.mockResolvedValue(undefined);

    render(<DefaultTemplateList editor={mockEditor as any} />);

    // 点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('confirm-button');
    fireEvent.click(confirmButtons[0]);

    // 验证加载过程
    expect(toast.loading).toHaveBeenCalledWith('加载中...');
    expect(mockEditor.loadFromJson).toHaveBeenCalledWith(mockTemplates[0].json);

    // 等待加载完成
    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('加载成功');
      // 验证模态框关闭方法被调用
      expect(responseCloseModelMock).toHaveBeenCalled();
    });
  });

  it('当responseRef.current为null时也能正常处理', async () => {
    vi.mocked(useTemplate).mockReturnValue({
      dataDefault: mockTemplates,
      isLoadingDefault: false,
      errorDefault: null,
    });

    mockEditor.loadFromJson.mockResolvedValue(undefined);

    // 手动设置responseCloseModelMock为null，模拟responseRef.current为null的情况
    responseCloseModelMock = null;

    render(<DefaultTemplateList editor={mockEditor as any} />);

    // 点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('confirm-button');
    fireEvent.click(confirmButtons[0]);

    // 验证加载过程
    expect(toast.loading).toHaveBeenCalledWith('加载中...');
    expect(mockEditor.loadFromJson).toHaveBeenCalledWith(mockTemplates[0].json);

    // 等待加载完成，即使responseRef.current为null，也不应该抛出错误
    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('加载成功');
    });
  });

  it('myTrigger 函数应该正确渲染模板预览', () => {
    const mockTemplate = {
      id: '1',
      name: '测试模板',
      description: '测试描述',
      image: '/test.jpg',
      json: '{}',
      sort: 3,
    };

    const trigger = myTrigger(mockTemplate);

    render(trigger);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test.jpg');
    expect(image).toHaveAttribute('alt', '测试模板');

    expect(screen.getByText('测试模板')).toBeInTheDocument();
  });
});
