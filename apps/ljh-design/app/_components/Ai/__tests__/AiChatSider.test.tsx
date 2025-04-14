import { Tool } from '@/app/_types/Edit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AiChatSider } from '../../EditComponents/asider/AiChatSider';

// 创建一个新的QueryClient实例用于测试
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// 包装测试组件的函数
const renderWithClient = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

// 模拟AI相关的hooks
vi.mock('@/app/_hook/query/useAi', () => {
  return {
    // 模拟设计生成功能
    useAiFabricStream: vi.fn(() => ({
      getAiFabricStream: vi.fn((data, options) => {
        // 创建模拟的ReadableStream响应
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // 模拟状态更新事件
            controller.enqueue(
              encoder.encode('event: status\ndata: {"message":"AI正在生成图形..."}\n\n'),
            );

            // 模拟结果事件
            setTimeout(() => {
              try {
                controller.enqueue(
                  encoder.encode(
                    `event: result\ndata: {"objects":[{"type":"Circle","fill":"red","radius":50,"left":100,"top":100}]}\n\n`,
                  ),
                );
                controller.enqueue(encoder.encode('event: complete\ndata: {}\n\n'));
                controller.close();
              } catch (error) {
                console.error('Stream controller error:', error);
              }
            }, 100);
          },
        });

        // 调用成功回调
        if (options?.onSuccess) {
          options.onSuccess(stream);
        }
        return stream;
      }),
      getAiFabricStreamPending: false,
    })),

    // 模拟图像生成功能
    useAiGenerateImage: vi.fn(() => ({
      generateImage: vi.fn((data, options) => {
        // 模拟图像生成结果
        const result = {
          success: true,
          data: {
            imageBase64: 'data:image/png;base64,mockImageData',
          },
        };

        // 调用成功回调
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      }),
      generateImagePending: false,
    })),
  };
});

// 模拟用户hook
vi.mock('@/app/_store/auth', () => {
  return {
    useUser: vi.fn(() => ({
      user: {
        user: {
          user_metadata: { name: '测试用户', image: 'https://example.com/avatar.jpg' },
        },
      },
    })),
  };
});

// 模拟Edit接口
const mockEditor = {
  addObjectsToCanvas: vi.fn(),
  addAiImage: vi.fn(),
};

// 模拟UI组件
vi.mock('@/app/_components/ui/button', () => {
  return {
    Button: ({ children, onClick, size, variant }: any) => (
      <button type="button" data-testid="button" onClick={onClick}>
        {children}
      </button>
    ),
  };
});

vi.mock('@/app/_components/ui/card', () => {
  return {
    Card: ({ children, className }: any) => (
      <div data-testid="card" className={className}>
        {children}
      </div>
    ),
  };
});

vi.mock('@/app/_components/ui/separator', () => {
  return {
    Separator: ({ className }: any) => <div data-testid="separator" className={className} />,
  };
});

vi.mock('@/app/_components/ui/textarea', () => {
  return {
    Textarea: ({ value, onChange, placeholder, ...props }: any) => (
      <textarea
        data-testid="textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    ),
  };
});

vi.mock('@/app/_components/ui/checkbox', () => {
  return {
    Checkbox: ({ value, onClick, ...props }: any) => (
      <input
        type="checkbox"
        data-testid="checkbox"
        checked={value === 'image'}
        onChange={onClick}
        {...props}
      />
    ),
  };
});

vi.mock('@/app/_components/ui/label', () => {
  return {
    Label: ({ children, htmlFor }: any) => (
      <label data-testid="label" htmlFor={htmlFor || 'mock-input'}>
        {children}
      </label>
    ),
  };
});

vi.mock('@/app/_components/ui/tooltip', () => {
  return {
    Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
    TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
    TooltipProvider: ({ children }: any) => <div data-testid="tooltip-provider">{children}</div>,
    TooltipTrigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
  };
});

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img src={src} alt={alt || '图片'} data-testid="next-image" {...props} />
  ),
}));

vi.mock('@/app/_components/Comand/AvatarImage', () => ({
  default: ({ src, alt, ...props }: any) => (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img src={src} alt={alt || '用户头像'} data-testid="avatar-image" {...props} />
  ),
}));

vi.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="icon-chevron-down">ChevronDown</div>,
  ChevronUp: () => <div data-testid="icon-chevron-up">ChevronUp</div>,
  Send: () => <div data-testid="icon-send">Send</div>,
  Trash2: () => <div data-testid="icon-trash">Trash2</div>,
}));

vi.mock('react-icons/fa6', () => ({
  FaRobot: () => <div data-testid="icon-robot">FaRobot</div>,
}));

// 模拟AiPreview组件
vi.mock('../../EditComponents/asider/AiPreview', () => ({
  default: () => <div data-testid="ai-preview">AiPreview Mock</div>,
}));

// 模拟nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-id'),
}));

describe('AiChatSider组件测试', () => {
  it('应该正确渲染AI聊天侧边栏', () => {
    renderWithClient(<AiChatSider editor={mockEditor as any} />);

    // 检查标题，使用getAllByText并取第一个匹配项
    expect(screen.getAllByText('AI 设计助手')[0]).toBeInTheDocument();

    // 检查输入框
    expect(screen.getByPlaceholderText('描述图形或图像...')).toBeInTheDocument();

    // 检查生成图像选项
    expect(screen.getByText('生成图像')).toBeInTheDocument();

    // 检查发送按钮
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('应该处理发送消息和接收AI响应', async () => {
    renderWithClient(<AiChatSider editor={mockEditor as any} />);

    // 获取输入框和发送按钮
    const input = screen.getByPlaceholderText('描述图形或图像...');
    const sendButton = screen.getByTestId('button');

    // 输入消息
    fireEvent.change(input, { target: { value: '绘制一个红色的圆' } });

    // 点击发送按钮
    fireEvent.click(sendButton);

    // 验证用户消息被添加到聊天记录中
    expect(await screen.findByText('绘制一个红色的圆')).toBeInTheDocument();

    // 等待AI响应
    await waitFor(
      () => {
        // 检查AI状态更新
        expect(screen.getByText(/AI正在生成图形/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
