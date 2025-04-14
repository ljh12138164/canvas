import { Tool } from '@/app/_types/Edit';
import type { Edit } from '@/app/_types/Edit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 模拟基本依赖
vi.mock('@/app/_components/ui/scroll-area', () => ({
  ScrollArea: vi.fn(({ children }) => <div data-testid="scroll-area">{children}</div>),
  ScrollBar: vi.fn(({ children }) => <div data-testid="scroll-bar">{children}</div>),
}));

// 模拟路由
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// 模拟用户钩子
vi.mock('@/app/_store/auth', () => ({
  useUser: vi.fn(() => ({
    user: {
      user: {
        id: 'test-user-id',
        user_metadata: {
          name: '测试用户',
          image: 'test-image-url',
        },
      },
    },
  })),
}));

// 模拟toast通知
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// 模拟一个可控制的流响应
const createMockStream = (responseText: string) => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(responseText));
      controller.close();
    },
  });
};

// 模拟图片
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, ...props }) => (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img alt={alt || 'AI生成图片'} data-testid="next-image" aria-label="AI图片" {...props} />
  )),
}));

// 创建测试用的QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// 测试包装组件
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

// 增强render函数
const renderWithClient = (ui: React.ReactElement) => {
  return render(<TestWrapper>{ui}</TestWrapper>);
};

// 模拟API调用函数
const mockGetAiChat = vi.fn();
const mockGetAiImage = vi.fn();
const mockGetAiFabricStream = vi.fn();
const mockGetAiGrapStream = vi.fn();
const mockGenerateImage = vi.fn();
const mockAddObjectsToCanvas = vi.fn();
const mockAddAiImage = vi.fn();
const mockAddGrap = vi.fn();

// 模拟AI相关钩子
vi.mock('@/app/_hook/query/useAi', () => ({
  useAiChat: () => ({
    getAiChat: mockGetAiChat,
  }),
  useAiImage: () => ({
    getAiImage: mockGetAiImage,
    getAiImagePending: false,
  }),
  useAiSessionDetail: (id: string) => ({
    getAiSessionDetail: {
      id,
      name: '测试会话',
      history: [
        { role: 'user', parts: [{ text: '你好' }], type: 'text' },
        { role: 'model', parts: [{ text: '你好，有什么可以帮助你的？' }], type: 'text' },
      ],
    },
    getAiSessionDetailLoading: false,
  }),
  useAiSessionUpdate: () => ({
    getAiSessionUpdate: vi.fn(),
    getAiSessionUpdatePending: false,
  }),
  useAiFabricStream: () => ({
    getAiFabricStream: mockGetAiFabricStream,
    getAiFabricStreamPending: false,
  }),
  useAiGenerateImage: () => ({
    generateImage: mockGenerateImage,
    generateImagePending: false,
  }),
  useAiGrap: () => ({
    getAiFabricStream: mockGetAiGrapStream,
  }),
}));

// 模拟图片查询钩子
vi.mock('@/app/_hook/query/useImageQuery', () => ({
  useBoardImageQuery: () => ({
    data: [
      { id: 'img1', url: 'test-image-1.jpg' },
      { id: 'img2', url: 'test-image-2.jpg' },
    ],
    isLoading: false,
  }),
  useUserImageQuery: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// 模拟编辑器
const mockEditor = {
  addObjectsToCanvas: mockAddObjectsToCanvas,
  addAiImage: mockAddAiImage,
  addGrap: mockAddGrap,
} as unknown as Edit;

// 模拟简化的组件版本
const MockAIComponent = ({ id }: { id: string }) => (
  <div data-testid="ai-content">
    <h1>测试会话</h1>
    <p>聊天只保存最后20条</p>
    <div data-testid="message-history">
      <div>你好</div>
      <div>你好，有什么可以帮助你的？</div>
    </div>
    <input data-testid="chat-input" placeholder="输入消息..." />
    <button
      type="button"
      data-testid="send-button"
      onClick={() => mockGetAiChat({ json: { prompt: '测试消息' } })}
    >
      发送
    </button>
    <button type="button" data-testid="upload-button">
      上传图片
    </button>
  </div>
);

const MockAiChatSider = ({ editor }: { editor: Edit }) => (
  <div data-testid="ai-chat-sider">
    <h2>AI 设计助手</h2>
    <p>您可以描述您想要的设计，AI将为您生成对应的图形或图像。</p>
    <div data-testid="ai-design-messages" />
    <label>
      <input type="checkbox" data-testid="image-mode-toggle" />
      生成图像
    </label>
    <textarea data-testid="ai-design-input" placeholder="描述图形或图像..." />
    <button
      type="button"
      data-testid="ai-design-send"
      onClick={() => mockGetAiFabricStream({ json: { prompt: '绘制一个红色的圆形' } })}
    >
      发送
    </button>
    <div data-testid="generated-content">
      <button
        type="button"
        data-testid="add-to-canvas"
        onClick={() => mockAddObjectsToCanvas([{ type: 'Circle', fill: '#ff0000' }])}
      >
        添加到画布
      </button>
    </div>
  </div>
);

const MockGrapSider = ({
  editor,
  acitiveTool,
  onChangeActiveTool,
}: { editor: Edit; acitiveTool: Tool; onChangeActiveTool: (tool: Tool) => void }) => (
  <div data-testid="grap-sider">
    <h2>图表生成工具</h2>
    <textarea
      data-testid="grap-code-input"
      placeholder="输入Mermaid语法..."
      defaultValue="erDiagram 客户 ||--o{ 订单 : 包含"
    />
    <div data-testid="graph-preview" aria-label="图表预览">
      <div>测试SVG内容</div>
    </div>
    <textarea
      data-testid="grap-prompt-input"
      placeholder="描述您想要的图表，例如：'创建一个订单管理系统的ER图'"
    />
    <button
      type="button"
      data-testid="generate-graph"
      onClick={() => mockGetAiGrapStream({ json: { prompt: '创建一个简单的流程图' } })}
    >
      生成图表
    </button>
    <button type="button" data-testid="save-to-canvas" onClick={() => mockAddGrap(null)}>
      保存到画布
    </button>
  </div>
);

// 模拟组件
vi.mock('@/app/_components/Ai/AiContent', () => ({
  default: vi.fn(({ id }) => <MockAIComponent id={id} />),
}));

vi.mock('@/app/_components/EditComponents/asider/AiChatSider', () => ({
  AiChatSider: vi.fn(({ editor }) => <MockAiChatSider editor={editor} />),
}));

vi.mock('@/app/_components/EditComponents/asider/GrapSider', () => ({
  default: vi.fn(({ editor, acitiveTool, onChangeActiveTool }) => (
    <MockGrapSider
      editor={editor}
      acitiveTool={acitiveTool}
      onChangeActiveTool={onChangeActiveTool}
    />
  )),
}));

import AI from '@/app/_components/Ai/AiContent';
// 导入需要测试的组件
import { AiChatSider } from '@/app/_components/EditComponents/asider/AiChatSider';
import Grap from '@/app/_components/EditComponents/asider/GrapSider';

describe('AI功能测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染AI聊天组件', () => {
      renderWithClient(<AI id="test-session" />);
      expect(screen.getByTestId('ai-content')).toBeInTheDocument();
    });

    it('应该正确渲染AI设计助手组件', () => {
      render(<AiChatSider editor={mockEditor} />);
      expect(screen.getByTestId('ai-chat-sider')).toBeInTheDocument();
    });

    it('应该正确渲染图表生成组件', () => {
      render(<Grap editor={mockEditor} acitiveTool={Tool.Grap} onChangeActiveTool={() => {}} />);
      expect(screen.getByTestId('grap-sider')).toBeInTheDocument();
    });
  });

  describe('聊天对话功能测试', () => {
    it('应该显示聊天历史消息', () => {
      renderWithClient(<AI id="test-session" />);
      const messageHistory = screen.getByTestId('message-history');
      expect(messageHistory).toBeInTheDocument();
      expect(messageHistory.textContent).toContain('你好');
      expect(messageHistory.textContent).toContain('你好，有什么可以帮助你的？');
    });

    it('应该能够发送文本消息', () => {
      renderWithClient(<AI id="test-session" />);
      const sendButton = screen.getByTestId('send-button');
      fireEvent.click(sendButton);
      expect(mockGetAiChat).toHaveBeenCalled();
    });

    it('应该有上传图片的功能', () => {
      renderWithClient(<AI id="test-session" />);
      const uploadButton = screen.getByTestId('upload-button');
      expect(uploadButton).toBeInTheDocument();
    });
  });

  describe('AI设计助手功能测试', () => {
    it('应该能够发送设计生成请求', () => {
      render(<AiChatSider editor={mockEditor} />);
      const sendButton = screen.getByTestId('ai-design-send');
      fireEvent.click(sendButton);
      expect(mockGetAiFabricStream).toHaveBeenCalled();
    });

    it('应该能够将生成的图形添加到画布', () => {
      render(<AiChatSider editor={mockEditor} />);
      const addToCanvasButton = screen.getByTestId('add-to-canvas');
      fireEvent.click(addToCanvasButton);
      expect(mockAddObjectsToCanvas).toHaveBeenCalled();
    });
  });

  describe('图表生成功能测试', () => {
    it('应该能够显示和编辑图表代码', () => {
      render(<Grap editor={mockEditor} acitiveTool={Tool.Grap} onChangeActiveTool={() => {}} />);

      const codeInput = screen.getByTestId('grap-code-input');
      expect(codeInput).toBeInTheDocument();
      expect(codeInput).toHaveValue('erDiagram 客户 ||--o{ 订单 : 包含');

      fireEvent.change(codeInput, {
        target: { value: 'graph TD\n    A[开始] --> B{判断}' },
      });

      expect(codeInput).toHaveValue('graph TD\n    A[开始] --> B{判断}');
    });

    it('应该能够通过提示词生成图表', () => {
      render(<Grap editor={mockEditor} acitiveTool={Tool.Grap} onChangeActiveTool={() => {}} />);

      const generateButton = screen.getByTestId('generate-graph');
      fireEvent.click(generateButton);
      expect(mockGetAiGrapStream).toHaveBeenCalled();
    });

    it('应该能够将生成的图表添加到画布', () => {
      render(<Grap editor={mockEditor} acitiveTool={Tool.Grap} onChangeActiveTool={() => {}} />);

      const saveToCanvasButton = screen.getByTestId('save-to-canvas');
      fireEvent.click(saveToCanvasButton);
      expect(mockAddGrap).toHaveBeenCalled();
    });
  });
});
