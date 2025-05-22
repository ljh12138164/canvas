import { Tool } from '@/app/_types/Edit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AiChatSider } from '../../EditComponents/asider/AiChatSider';
import GrapSider from '../../EditComponents/asider/GrapSider';
import AiList from '../AiList';
import AiMain from '../AiMain';

/**
 * AI助手模块综合测试
 *
 * 功能点覆盖：
 * - Ai聊天对话的实现
 * - Ai文生图的实现
 * - Ai文生图的插入画布
 * - Ai设计生成的添加画布中
 * - Ai图表生成
 * - 图表生成的添加画布中
 * - Ai设计生成
 */

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

// ==== 通用模拟设置 ====

// 模拟AI相关的hooks
vi.mock('@/app/_hook/query/useAi', () => {
  return {
    // 模拟聊天历史功能
    useAiSessionList: vi.fn(() => ({
      getAiSessionList: [
        { id: '1', name: '测试对话1', created_at: '2023-01-01T00:00:00Z' },
        { id: '2', name: '测试对话2', created_at: '2023-01-02T00:00:00Z' },
      ],
      getAiSessionListLoading: false,
    })),

    // 模拟删除聊天功能
    useAiSessionDelete: vi.fn(() => ({
      getAiSessionDelete: vi.fn(),
    })),

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
vi.mock('react-icons/fa6', async () => {
  return {
    FaRobot: () => React.createElement('div', { 'data-testid': 'icon-robot' }, 'FaRobot'),
    FaCircle: () => React.createElement('div', { 'data-testid': 'icon-circle' }, 'FaCircle'),
    FaDiamond: () => React.createElement('div', { 'data-testid': 'icon-diamond' }, 'FaDiamond'),
    FaSquare: () => React.createElement('div', { 'data-testid': 'icon-square' }, 'FaSquare'),
    FaSquareFull: () =>
      React.createElement('div', { 'data-testid': 'icon-square-full' }, 'FaSquareFull'),
  };
});
// 模拟用户hook
vi.mock('@/app/_hook/useUser', () => {
  return {
    default: vi.fn(() => ({
      user: {
        user: {
          user_metadata: {
            name: '测试用户',
            image: 'https://example.com/avatar.jpg',
          },
        },
      },
      loading: false,
    })),
  };
});

// 模拟auth
vi.mock('@/app/_store/auth', () => {
  return {
    useUser: vi.fn(() => ({
      user: {
        user: {
          user_metadata: {
            name: '测试用户',
            image: 'https://example.com/avatar.jpg',
          },
        },
      },
    })),
  };
});

// 模拟next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// 模拟mermaid
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>模拟的图表SVG</svg>' }),
  },
}));

// 模拟Edit接口
const mockEditor = {
  addObjectsToCanvas: vi.fn(),
  addAiImage: vi.fn(),
  addGrap: vi.fn().mockResolvedValue(true),
};

// ==== UI组件模拟 ====

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
    Card: ({ children, className, onClick }: any) => (
      <div data-testid="card" className={className} onClick={onClick}>
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

vi.mock('@/app/_components/ui/scroll-area', () => {
  return {
    ScrollArea: ({ children, className }: any) => (
      <div data-testid="scroll-area" className={className}>
        {children}
      </div>
    ),
  };
});

vi.mock('@/app/_components/ui/skeleton', () => {
  return {
    Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
  };
});

// 模拟Response组件
vi.mock('../../Comand/Response', () => ({
  Response: ({ children, onConfirm, myTrigger }: any) => (
    <div data-testid="response">
      {myTrigger}
      <button type="button" onClick={onConfirm}>
        确认
      </button>
      {children}
    </div>
  ),
}));

// 模拟next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    // biome-ignore lint/a11y/useAltText: 测试模拟
    <img src={src} alt={alt || '图片'} data-testid="next-image" {...props} />
  ),
}));

// 模拟AvatarImage
vi.mock('@/app/_components/Comand/AvatarImage', () => ({
  default: ({ src, alt, ...props }: any) => (
    // biome-ignore lint/a11y/useAltText: 测试模拟
    <img src={src} alt={alt || '用户头像'} data-testid="avatar-image" {...props} />
  ),
}));

// 模拟lucide-react图标
vi.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="icon-chevron-down">ChevronDown</div>,
  ChevronUp: () => <div data-testid="icon-chevron-up">ChevronUp</div>,
  Send: () => <div data-testid="icon-send">Send</div>,
  Trash2: () => <div data-testid="icon-trash">Trash2</div>,
  Code: () => <div data-testid="icon-code">Code</div>,
  Bot: () => <div data-testid="icon-bot">Bot</div>,
  RefreshCw: () => <div data-testid="icon-refresh">RefreshCw</div>,
  Trash: () => <span>Trash Icon</span>,
}));

// 模拟AiPreview组件
vi.mock('../../EditComponents/asider/AiPreview', () => ({
  default: () => <div data-testid="ai-preview">AiPreview Mock</div>,
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

// 简化的dayjs模拟
vi.mock('dayjs', () => {
  const dayjsMock = (date: string) => ({
    format: () => '2023-01-01',
  });
  return {
    default: dayjsMock,
  };
});

vi.mock('react-hot-toast', () => {
  return {
    default: {
      success: vi.fn(),
      error: vi.fn(),
      loading: vi.fn(),
      dismiss: vi.fn(),
    },
  };
});
// ==== 测试套件 ====

describe('AI助手模块', () => {
  describe('1. Ai聊天对话的实现', () => {
    it('正确渲染聊天历史列表', () => {
      renderWithClient(<AiList />);

      // 检查标题
      expect(screen.getByText('历史对话')).toBeInTheDocument();

      // 使用更精确的选择器测试聊天历史项
      const chatItems = screen.getAllByTestId('card');
      expect(chatItems.length).toBe(2);

      // 检查第一个对话的内容
      const chatTitles = screen.getAllByText('测试对话1', { exact: false });
      expect(chatTitles.length).toBeGreaterThan(0);

      // 确认日期格式化正确
      expect(screen.getAllByText('2023-01-01')[0]).toBeInTheDocument();
    });

    it('正确渲染AI主页面', () => {
      renderWithClient(<AiMain />);

      // AiMain渲染了AiList组件
      expect(screen.getByText('历史对话')).toBeInTheDocument();

      // 检查聊天卡片是否渲染
      const chatItems = screen.getAllByTestId('card');
      expect(chatItems.length).toBe(2);
    });
  });

  describe('2. Ai文生图的实现', () => {
    it('处理文生图并显示生成的图像', async () => {
      renderWithClient(<AiChatSider editor={mockEditor as any} />);

      // 获取输入框、生成图像复选框和发送按钮
      const input = screen.getByPlaceholderText('描述图形或图像...');
      const imageCheckbox = screen.getByTestId('checkbox');
      const sendButton = screen.getByTestId('button');

      // 切换到图像生成模式
      fireEvent.click(imageCheckbox);

      // 输入消息 - 文生图
      fireEvent.change(input, { target: { value: '生成一张宇航员图片' } });

      // 点击发送按钮
      fireEvent.click(sendButton);

      // 验证用户消息被添加到聊天记录中
      expect(await screen.findByText('生成一张宇航员图片')).toBeInTheDocument();

      // 等待AI响应
      await waitFor(
        () => {
          // 检查AI状态更新
          expect(screen.getByText(/AI正在生成图像/i)).toBeInTheDocument();
        },
        { timeout: 1000 },
      );

      // 等待图像生成并显示
      await waitFor(
        () => {
          // 模拟检查图像是否存在
          const images = screen.getAllByTestId('next-image');
          expect(images.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );
    });
  });

  describe('3. Ai文生图的插入画布', () => {
    it('将生成的图像添加到画布中', async () => {
      // 重置模拟函数
      mockEditor.addAiImage.mockReset();

      renderWithClient(<AiChatSider editor={mockEditor as any} />);

      // 获取输入框、生成图像复选框和发送按钮
      const input = screen.getByPlaceholderText('描述图形或图像...');
      const imageCheckbox = screen.getByTestId('checkbox');
      const sendButton = screen.getByTestId('button');

      // 切换到图像生成模式
      fireEvent.click(imageCheckbox);

      // 输入消息 - 文生图
      fireEvent.change(input, { target: { value: '生成一张宇航员图片' } });

      // 点击发送按钮
      fireEvent.click(sendButton);

      // 等待图像生成并显示
      await waitFor(
        () => {
          const images = screen.getAllByTestId('next-image');
          expect(images.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );

      // 寻找"添加到画布"按钮并点击
      const addToBoardButtons = await screen.findAllByText(/添加到画布/i);
      fireEvent.click(addToBoardButtons[addToBoardButtons.length - 1]);

      // 验证添加图像到画布的方法被调用
      expect(mockEditor.addAiImage).toHaveBeenCalled();
    });
  });

  describe('4. Ai设计生成', () => {
    it('正确渲染AI设计生成界面', () => {
      renderWithClient(<AiChatSider editor={mockEditor as any} />);

      // 检查标题
      expect(screen.getAllByText('AI 设计助手')[0]).toBeInTheDocument();

      // 检查输入框
      expect(screen.getByPlaceholderText('描述图形或图像...')).toBeInTheDocument();

      // 检查发送按钮
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('处理设计生成请求', async () => {
      renderWithClient(<AiChatSider editor={mockEditor as any} />);

      // 获取输入框和发送按钮
      const input = screen.getByPlaceholderText('描述图形或图像...');
      const sendButton = screen.getByTestId('button');

      // 输入消息 - 设计生成
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

      // 等待结果显示
      await waitFor(
        () => {
          const resultMessage = screen.getByText(/我已根据您的描述生成了/i);
          expect(resultMessage).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  });

  describe('5. Ai设计生成的添加画布中', () => {
    it('将生成的设计添加到画布中', async () => {
      // 重置模拟函数
      mockEditor.addObjectsToCanvas.mockReset();

      renderWithClient(<AiChatSider editor={mockEditor as any} />);

      // 获取输入框和发送按钮
      const input = screen.getByPlaceholderText('描述图形或图像...');
      const sendButton = screen.getByTestId('button');

      // 输入消息 - 设计生成
      fireEvent.change(input, { target: { value: '绘制一个红色的圆' } });

      // 点击发送按钮
      fireEvent.click(sendButton);

      // 等待结果显示
      await waitFor(
        () => {
          const resultMessage = screen.getByText(/我已根据您的描述生成了/i);
          expect(resultMessage).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      // 寻找"添加到画布"按钮并点击
      const addToBoardButton = await screen.findByText(/添加到画布/i);
      fireEvent.click(addToBoardButton);

      // 验证添加到画布的方法被调用
      expect(mockEditor.addObjectsToCanvas).toHaveBeenCalled();
    });
  });

  describe('6. Ai图表生成', () => {
    it('正确渲染图表生成界面', () => {
      renderWithClient(
        <GrapSider
          editor={mockEditor as any}
          acitiveTool={Tool.Grap}
          onChangeActiveTool={vi.fn()}
        />,
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

    it('生成图表并显示代码和预览', async () => {
      renderWithClient(
        <GrapSider
          editor={mockEditor as any}
          acitiveTool={Tool.Grap}
          onChangeActiveTool={vi.fn()}
        />,
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

      // 等待图表代码生成
      await waitFor(
        () => {
          expect(screen.getByText(/生成的Mermaid代码/i)).toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });
  });

  describe('7. 图表生成的添加画布中', () => {
    it('将生成的图表添加到画布中', async () => {
      // 重置模拟函数
      mockEditor.addGrap.mockReset();
      mockEditor.addGrap.mockResolvedValue(true);

      renderWithClient(
        <GrapSider
          editor={mockEditor as any}
          acitiveTool={Tool.Grap}
          onChangeActiveTool={vi.fn()}
        />,
      );

      // 获取输入框和发送按钮
      const input = screen.getByPlaceholderText(/描述您想要的图表/);
      const sendButtons = screen.getAllByTestId('button');

      // 输入消息
      fireEvent.change(input, { target: { value: '创建一个简单的流程图' } });

      // 点击发送按钮
      fireEvent.click(sendButtons[0]);

      // 等待图表代码生成
      await waitFor(
        () => {
          expect(screen.getByText(/生成的Mermaid代码/i)).toBeInTheDocument();
        },
        { timeout: 1000 },
      );

      // 寻找"保存到画布"按钮并点击
      const saveToCanvasButton = screen.getByText(/保存到画布/i);
      fireEvent.click(saveToCanvasButton);

      // 验证添加图表到画布的方法被调用
      expect(mockEditor.addGrap).toHaveBeenCalled();
    });
  });
});
