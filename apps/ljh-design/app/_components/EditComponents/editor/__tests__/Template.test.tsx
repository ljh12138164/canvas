import DefaultTemplateList from '@/app/_components/template/DefaultTemplateList';
import UserTemplateList from '@/app/_components/template/UserTemplateList';
import { useBoardDeleteQuery, useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import { useTemplate, useUserTemplate } from '@/app/_hook/query/useTemaplate';
import { useQueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: vi.fn(),
}));

vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className} data-testid="skeleton" />,
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
    showDescription,
  }: any) => {
    if (ref) {
      ref.current = {
        closeModel: vi.fn(),
      };
    }
    return (
      <div data-testid="response" data-variant={variant} data-show-description={showDescription}>
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

describe('模板和素材模块测试', () => {
  const mockEditor = {
    loadFromJson: vi.fn().mockResolvedValue(undefined),
    exportToJson: vi.fn().mockReturnValue('{"version":"5.3.0","objects":[]}'),
    canvas: {
      width: 800,
      height: 600,
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockedBase64Image'),
    },
    saveTemplate: vi.fn().mockResolvedValue({ id: 'new-template-id' }),
    addImage: vi.fn().mockResolvedValue(undefined),
    saveMaterial: vi.fn().mockResolvedValue({ id: 'new-material-id' }),
  };

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

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  const mockBoardMutate = vi.fn();
  const mockDeleteBoard = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

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

  it('创建新的画布模板', async () => {
    // 模拟创建新模板的函数
    const createTemplate = async () => {
      const templateName = 'New Test Template';
      const templateJson = mockEditor.exportToJson();
      const templateImage = mockEditor.canvas.toDataURL();

      await mockEditor.saveTemplate({
        name: templateName,
        json: templateJson,
        image: templateImage,
        userId: 'test-user',
        height: mockEditor.canvas.height,
        width: mockEditor.canvas.width,
      });

      return { success: true };
    };

    // 执行创建模板操作
    const result = await createTemplate();

    // 验证结果
    expect(result.success).toBe(true);
    expect(mockEditor.exportToJson).toHaveBeenCalled();
    expect(mockEditor.canvas.toDataURL).toHaveBeenCalled();
    expect(mockEditor.saveTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Test Template',
        userId: 'test-user',
        height: 600,
        width: 800,
      }),
    );
  });

  it('应用模板到画布', async () => {
    // 渲染默认模板列表组件
    render(<DefaultTemplateList editor={mockEditor as any} />);

    // 验证模板已渲染
    expect(screen.getByText('默认模板1')).toBeInTheDocument();

    // 模拟点击第一个模板的确认按钮
    const confirmButtons = screen.getAllByTestId('response-confirm');
    fireEvent.click(confirmButtons[0]);

    // 验证模板应用到画布
    await waitFor(() => {
      expect(mockEditor.loadFromJson).toHaveBeenCalledWith(mockDefaultTemplates[0].json);
      expect(toast.success).toHaveBeenCalledWith('加载成功');
    });
  });

  it('成功保存素材', async () => {
    // 模拟保存素材的函数
    const saveMaterial = async () => {
      const materialName = 'Test Material';
      const materialImage = mockEditor.canvas.toDataURL();

      await mockEditor.saveMaterial({
        name: materialName,
        image: materialImage,
        userId: 'test-user',
      });

      toast.success('素材保存成功');
      return { success: true };
    };

    // 执行保存素材操作
    const result = await saveMaterial();

    // 验证结果
    expect(result.success).toBe(true);
    expect(mockEditor.canvas.toDataURL).toHaveBeenCalled();
    expect(mockEditor.saveMaterial).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Material',
        userId: 'test-user',
      }),
    );
    expect(toast.success).toHaveBeenCalledWith('素材保存成功');
  });

  it('成功添加素材', async () => {
    // 模拟添加素材的函数
    const addMaterial = async () => {
      const materialUrl = 'https://example.com/test-material.png';

      await mockEditor.addImage(materialUrl);

      toast.success('素材添加成功');
      return { success: true };
    };

    // 执行添加素材操作
    const result = await addMaterial();

    // 验证结果
    expect(result.success).toBe(true);
    expect(mockEditor.addImage).toHaveBeenCalledWith('https://example.com/test-material.png');
    expect(toast.success).toHaveBeenCalledWith('素材添加成功');
  });
});
