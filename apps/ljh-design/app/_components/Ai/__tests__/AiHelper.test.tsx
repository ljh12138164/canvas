import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AiList from '../AiList';
import AiMain from '../AiMain';

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
  };
});

// 模拟用户hook
vi.mock('@/app/_hook/useUser', () => {
  return {
    default: vi.fn(() => ({
      user: {
        user: {
          user_metadata: { name: '测试用户', image: 'https://example.com/avatar.jpg' },
        },
      },
      loading: false,
    })),
  };
});

// 模拟next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// 模拟card组件
vi.mock('@/app/_components/ui/card', () => {
  return {
    Card: ({ children, className, onClick }: any) => (
      <div data-testid="card" className={className} onClick={onClick}>
        {children}
      </div>
    ),
  };
});

// 模拟ScrollArea组件
vi.mock('@/app/_components/ui/scroll-area', () => {
  return {
    ScrollArea: ({ children, className }: any) => (
      <div data-testid="scroll-area" className={className}>
        {children}
      </div>
    ),
  };
});

// 模拟Button组件
vi.mock('@/app/_components/ui/button', () => {
  return {
    Button: ({ children, onClick, variant }: any) => (
      <button type="button" data-testid="button" onClick={onClick}>
        {children}
      </button>
    ),
  };
});

// 模拟Skeleton组件
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

// 模拟lucide-react图标
vi.mock('lucide-react', () => ({
  Trash: () => <span>Trash Icon</span>,
}));

// 模拟nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-id'),
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

describe('AI助手模块测试', () => {
  describe('AiList组件', () => {
    it('应该正确渲染聊天历史列表', () => {
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
  });

  describe('AiMain组件', () => {
    it('应该正确渲染AI主页面', () => {
      renderWithClient(<AiMain />);

      // AiMain应该渲染了AiList组件
      expect(screen.getByText('历史对话')).toBeInTheDocument();

      // 检查聊天卡片是否渲染
      const chatItems = screen.getAllByTestId('card');
      expect(chatItems.length).toBe(2);
    });
  });
});
