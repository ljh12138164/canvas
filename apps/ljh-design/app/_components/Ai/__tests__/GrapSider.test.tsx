import { Tool } from '@/app/_types/Edit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GrapSider from '../../EditComponents/asider/GrapSider';

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

// 模拟mermaid
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>模拟的图表SVG</svg>' }),
  },
}));

// 模拟AI图表生成功能
vi.mock('@/app/_hook/query/useAi', () => {
  return {
    // 模拟图表生成功能
    useAiGrap: vi.fn(() => ({
      getAiFabricStream: vi.fn((data, options) => {
        // 创建模拟的ReadableStream响应
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // 模拟状态更新事件
            controller.enqueue(
              encoder.encode('event: status\ndata: {"message":"AI正在生成图表..."}\n\n'),
            );

            // 模拟结果事件 - 使用Promise包装，确保顺序执行
            setTimeout(() => {
              try {
                controller.enqueue(
                  encoder.encode(
                    `event: result\ndata: {"code":"graph TD\\nA[开始] --> B[处理]\\nB --> C[结束]"}\n\n`,
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
  };
});

// 模拟Edit接口
const mockEditor = {
  addGrap: vi.fn().mockResolvedValue(true),
};

// 模拟modal对话框组件
vi.mock('@/app/_components/ui/dialog', () => {
  return {
    Dialog: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog">{children}</div>
    ),
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-content">{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-header">{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-title">{children}</div>
    ),
    DialogDescription: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-description">{children}</div>
    ),
    DialogClose: vi.fn(),
  };
});

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

// 模拟lucide-react图标
vi.mock('lucide-react', () => ({
  Code: () => <div data-testid="icon-code">Code</div>,
  Bot: () => <div data-testid="icon-bot">Bot</div>,
  Send: () => <div data-testid="icon-send">Send</div>,
  Trash2: () => <div data-testid="icon-trash">Trash2</div>,
  RefreshCw: () => <div data-testid="icon-refresh">RefreshCw</div>,
}));

// 模拟nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-id'),
}));

// 模拟react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('GrapSider组件测试', () => {
  it('正确渲染图表生成对话框', () => {
    renderWithClient(
      <GrapSider editor={mockEditor as any} acitiveTool={Tool.Grap} onChangeActiveTool={vi.fn()} />,
    );

    // 检查标题
    expect(screen.getByText('图表生成工具')).toBeInTheDocument();

    // 检查输入区域
    expect(screen.getByPlaceholderText(/描述您想要的图表/)).toBeInTheDocument();

    // 检查代码区域
    expect(screen.getByText('图表代码')).toBeInTheDocument();

    // 检查图表区域
    expect(screen.getByText('生成的图表')).toBeInTheDocument();
  });

  it('处理发送消息和生成图表', async () => {
    renderWithClient(
      <GrapSider editor={mockEditor as any} acitiveTool={Tool.Grap} onChangeActiveTool={vi.fn()} />,
    );

    // 获取输入框和发送按钮
    const input = screen.getByPlaceholderText(/描述您想要的图表/);
    const sendButtons = screen.getAllByTestId('button');

    // 输入消息
    fireEvent.change(input, { target: { value: '创建一个简单的流程图' } });

    // 点击发送按钮 (通常是第一个按钮)
    fireEvent.click(sendButtons[0]);

    // 验证用户消息被添加到聊天记录中
    expect(await screen.findByText('创建一个简单的流程图')).toBeInTheDocument();

    // 等待AI响应
    await waitFor(
      () => {
        // 检查AI状态更新
        expect(screen.getByText(/AI正在生成图表/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
