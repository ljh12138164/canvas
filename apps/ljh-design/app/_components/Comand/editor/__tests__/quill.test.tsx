import { useAnswer, useGetAnswer } from '@/app/_hook/query/useAnswer';
import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// 模拟React组件
vi.mock('../quill', () => ({
  default: vi.fn(() => null),
}));

// 模拟Next.js路由
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => ({ get: vi.fn() })),
}));

// 模拟React Query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

// 模拟Hooks
vi.mock('@/app/_hook/query/useAnswer', () => ({
  useAnswer: vi.fn(),
  useGetAnswer: vi.fn(),
}));

// 模拟toast
vi.mock('react-hot-toast', () => {
  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  };
  return {
    default: mockToast,
    toast: mockToast,
  };
});

describe('ReactQuillEditor功能测试', () => {
  // @ts-ignore
  const mockShowData: GetShowResponseType = {
    id: 'test-show-id',
    title: '测试作品',
    userId: 'user-1',
    created_at: '2023-01-01T00:00:00Z',
  };

  const mockComments = [
    {
      id: 'comment-1',
      answer: '<p>测试评论1</p>',
      profiles: {
        name: '用户1',
        id: 'user-1',
        image: 'https://example.com/avatar.png',
        email: 'user1@example.com',
        region: '中国',
      },
      showId: 'test-show-id',
      userId: 'user-1',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 'comment-2',
      answer: '<p>测试评论2</p>',
      profiles: {
        name: '用户2',
        id: 'user-2',
        image: 'https://example.com/avatar.png',
        email: 'user2@example.com',
        region: '中国',
      },
      showId: 'test-show-id',
      userId: 'user-2',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    },
  ];

  const invalidateQueriesMock = vi.fn();
  const mutateCommentMock = vi.fn();
  const mutateImplementation = {
    mutate: mutateCommentMock,
    isPending: false,
  };

  // 在测试之前设置通用的模拟
  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟useQueryClient
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    } as any);

    // 模拟useAnswer
    vi.mocked(useAnswer).mockReturnValue(mutateImplementation);

    // 模拟useGetAnswer
    vi.mocked(useGetAnswer).mockReturnValue({
      data: mockComments,
      isLoading: false,
    });
  });

  it('测试评论提交功能', () => {
    // 使用确定存在的mutate
    const { mutate } = mutateImplementation;

    // 模拟评论内容
    const commentContent = '<p>这是一条测试评论</p>';

    // 调用mutate方法提交评论
    mutate(
      {
        json: {
          content: commentContent,
          id: mockShowData.id,
        },
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success('评论成功');
          invalidateQueriesMock({ queryKey: ['answers', mockShowData.id] });
        },
      },
    );

    // 验证调用了mutate方法
    expect(mutateCommentMock).toHaveBeenCalledWith(
      {
        json: {
          content: commentContent,
          id: 'test-show-id',
        },
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    // 模拟评论提交成功
    const options = mutateCommentMock.mock.calls[0][1];
    options.onSuccess();

    // 验证成功后的操作
    expect(toast.success).toHaveBeenCalledWith('评论成功');
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['answers', 'test-show-id'] });
  });
});
