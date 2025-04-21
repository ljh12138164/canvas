import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CreateShow from '../../Formue/CreateShow';
// 导入组件
import Form from '../../Formue/Form';
import { FormueItem } from '../../Formue/FormueItem';
import { ShowPage } from '../../Formue/ShowPage';
import FormueMain from '../FormueMain';
import { ShowHead } from '../ShowHead';
import { ShowOption } from '../ShowOption';

// 导入React Query
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 导入路由
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useClone } from '@/app/_hook/query/useClone';
import { useCancelCollection, useCollection } from '@/app/_hook/query/useColleciont';
// 导入hooks
import * as useFormueHooks from '@/app/_hook/query/useFormue';
import { useCreateMaterial } from '@/app/_hook/query/useMaterial';
import { useGetFormue } from '@/app/_hook/query/useShow';
import { useGetShow } from '@/app/_hook/query/useShow';
import { useCancelVote, useVote } from '@/app/_hook/query/useVote';
import { useUser } from '@/app/_store/auth';

// 模拟react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// 模拟Next.js路由
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/board/formue/form-123'),
  useParams: vi.fn(() => ({ id: 'form-123' })),
  useSearchParams: vi.fn(() => ({
    get: (key: string) => (key === 'search' ? '' : null),
  })),
}));

// 模拟图片组件
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: any;
    // biome-ignore lint/a11y/useAltText: <explanation>
  }) => <img data-testid="next-image" src={src || ''} alt={alt || '作品图片'} {...props} />,
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

// 模拟日期格式化
vi.mock('dayjs', () => ({
  default: () => ({
    format: () => '2023年5月10日',
    fromNow: () => '3天前',
  }),
}));

// 模拟hooks
vi.mock('@/app/_hook/query/useClone', () => ({
  useClone: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock('@/app/_hook/query/useMaterial', () => ({
  useCreateMaterial: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/app/_store/auth', () => ({
  useUser: vi.fn(() => ({
    user: {
      user: {
        id: 'current-user-id',
        name: '当前用户',
        image: 'https://example.com/current-user.jpg',
        user_metadata: {
          sub: 'different-user-id',
        },
      },
    },
  })),
}));

vi.mock('@/app/_hook/query/useVote', () => ({
  useVote: vi.fn(() => ({
    vote: vi.fn(),
    votePending: false,
  })),
  useCancelVote: vi.fn(() => ({
    cancelVote: vi.fn(),
    cancelVotePending: false,
  })),
}));

vi.mock('@/app/_hook/query/useColleciont', () => ({
  useCollection: vi.fn(() => ({
    collectionMutate: vi.fn(),
    collectionLoading: false,
  })),
  useCancelCollection: vi.fn(() => ({
    cancelCollection: vi.fn(),
    cancelCollectionPending: false,
  })),
}));

vi.mock('@/app/_hook/query/useShow', () => ({
  useGetShow: vi.fn(() => ({
    showFetching: false,
  })),
  useGetFormue: vi.fn(() => ({
    formueLoading: false,
  })),
}));

// 模拟Formue相关hooks
vi.mock('@/app/_hook/query/useFormue', () => ({
  useFormShow: vi.fn(() => ({
    data: {
      id: 'form-123',
      title: '测试作品详情',
      description: '这是一个测试作品的详细描述',
      upvotes: 15,
      collections: 8,
      comments: [
        {
          id: 'comment-1',
          user: {
            id: 'user-456',
            name: '评论用户1',
            image: 'https://example.com/avatar1.jpg',
          },
          content: '很棒的作品！',
          createdAt: '2023-05-10T10:00:00Z',
        },
        {
          id: 'comment-2',
          user: {
            id: 'user-789',
            name: '评论用户2',
            image: 'https://example.com/avatar2.jpg',
          },
          content: '非常实用',
          createdAt: '2023-05-11T11:00:00Z',
        },
      ],
      user: {
        id: 'user-123',
        name: '作品创建者',
        image: 'https://example.com/creator.jpg',
      },
      img: 'https://example.com/form-detail.jpg',
      createdAt: '2023-05-01T12:00:00Z',
      updatedAt: '2023-05-02T13:00:00Z',
      data: {
        form: {
          title: '表单标题',
          items: [
            { id: 'item-1', label: '项目1', type: 'text' },
            { id: 'item-2', label: '项目2', type: 'select' },
          ],
        },
      },
    },
    isLoading: false,
    error: null,
  })),
  useFormComment: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormCreate: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormEdit: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormPublish: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormCopy: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormUpvote: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useFormCollect: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

// 模拟UI组件
vi.mock('@/app/_components/ui/input', () => ({
  Input: vi.fn(({ placeholder, onChange, value, ...props }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...props}
    />
  )),
}));

vi.mock('@/app/_components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  )),
}));

vi.mock('@/app/_components/ui/textarea', () => ({
  Textarea: vi.fn(({ placeholder, onChange, value, ...props }: any) => (
    <textarea
      data-testid="textarea"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      {...props}
    />
  )),
}));

vi.mock('@/app/_components/ui/select', () => ({
  Select: vi.fn(({ onValueChange, value, children, ...props }: any) => (
    <select
      data-testid="select"
      onChange={(e) => onValueChange?.(e.target.value)}
      value={value}
      {...props}
    >
      {children}
    </select>
  )),
  SelectTrigger: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  )),
  SelectValue: vi.fn(({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value">{placeholder}</div>
  )),
  SelectContent: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  )),
  SelectItem: vi.fn(({ children, value }: { children: React.ReactNode; value: string }) => (
    <option data-testid="select-item" value={value}>
      {children}
    </option>
  )),
}));

vi.mock('@/app/_components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  ),
  DialogContent: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  )),
  DialogHeader: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  )),
  DialogTitle: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  )),
  DialogDescription: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-description">{children}</div>
  )),
  DialogFooter: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  )),
  DialogTrigger: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  )),
}));

vi.mock('@/app/_components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

vi.mock('@/app/_components/Comand/Response', () => ({
  Response: vi.fn(({ children, title, onConfirm, ref, myTrigger }: any) => {
    if (ref) {
      ref.current = { closeModel: vi.fn() };
    }
    return (
      <div data-testid="response-dialog">
        <h2>{title}</h2>
        <div>{myTrigger || <button type="button">触发器</button>}</div>
        <div data-testid="dialog-content">{children}</div>
        {onConfirm && (
          <button data-testid="confirm-button" type="button" onClick={onConfirm}>
            确认
          </button>
        )}
      </div>
    );
  }),
}));

vi.mock('@/app/_components/Board/BoardCreateFrom', () => ({
  default: ({
    children,
    mutate,
  }: {
    children: React.ReactNode;
    mutate: (data: any) => void;
  }) => (
    <form
      data-testid="board-create-form"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ name: '测试克隆' });
      }}
    >
      {children}
      <button type="submit">提交</button>
    </form>
  ),
}));

vi.mock('@/app/_components/Comand/ColorCard', () => ({
  default: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div data-testid="color-card">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/Comand/SkeletonCard', () => ({
  default: () => <div data-testid="skeleton">模拟骨架屏</div>,
}));

vi.mock('@/app/_components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton">模拟骨架屏元素</div>,
}));

vi.mock('../FormueList', () => ({
  default: () => <div data-testid="formue-list">模拟FormueList组件</div>,
}));

// 重要：正确模拟组件导入
vi.mock('../../Formue/FormueItem', () => ({
  FormueItem: vi.fn(({ formue }: any) => (
    <div data-testid="form-item">
      <div data-testid="formue-card">{formue.title}</div>
      <div>{formue.description}</div>
      <div data-testid="user-profile">{formue.user.name}</div>
    </div>
  )),
  default: vi.fn(({ title, description, type, options, placeholder }: any) => (
    <div data-testid="form-item">
      <div data-testid="item-title">{title}</div>
      {description && <div data-testid="item-description">{description}</div>}
      {type === 'text' && <input data-testid="text-input" placeholder={placeholder} />}
      {type === 'select' && (
        <select data-testid="select-input">
          {options?.map((option: string) => (
            <option key={JSON.stringify(option)} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  )),
}));

vi.mock('../../Formue/ShowHead', () => ({
  default: vi.fn(() => <div data-testid="show-head">作品头部组件</div>),
  ShowHead: vi.fn(({ showData, remarkRef }: any) => (
    <div data-testid="show-head">
      <h1>{showData.title}</h1>
      <p>发布时间: {showData.created_at}</p>
      {showData.tags.split(',').map((tag: string) => (
        <span key={JSON.stringify(tag)}>{tag}</span>
      ))}
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => remarkRef?.current?.scrollIntoView({ behavior: 'smooth' })}>
        跳转到评论
      </button>
    </div>
  )),
}));

vi.mock('../../Formue/ShowFooter', () => ({
  default: vi.fn(() => <div data-testid="show-footer">作品底部组件</div>),
}));

vi.mock('../../Formue/ShowMain', () => ({
  default: vi.fn(() => <div data-testid="show-main">作品主体内容</div>),
}));

vi.mock('../../Formue/ShowOption', () => ({
  ShowOption: vi.fn(({ showData, id }: any) => (
    <div data-testid="show-option">
      <button type="button" disabled={false} aria-label="点赞">
        {showData.isUpvote ? '已点赞' : '点赞'}
      </button>
      <button type="button" disabled={false} aria-label="收藏">
        {showData.isCollect ? '已收藏' : '收藏'}
      </button>
      {showData.comments?.map((comment: any) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>{comment.user.name}</p>
        </div>
      ))}
      <input placeholder="添加评论..." />
      <button type="button" aria-label="发送">
        发送
      </button>
    </div>
  )),
}));

vi.mock('../../Formue/ShowPage', () => ({
  ShowPage: vi.fn(({ id }: { id: string }) => (
    <div data-testid="show-page">
      <div data-testid="show-head">作品头部组件</div>
      <div data-testid="show-main">作品主体内容</div>
      <div data-testid="show-footer">作品底部组件</div>
    </div>
  )),
}));

// 测试数据
const mockFormueData = {
  id: 'form-123',
  title: '测试作品详情',
  description: '这是一个测试作品的详细描述',
  upvotes: 15,
  collections: 8,
  comments: [
    {
      id: 'comment-1',
      user: {
        id: 'user-456',
        name: '评论用户1',
        image: 'https://example.com/avatar1.jpg',
      },
      content: '很棒的作品！',
      createdAt: '2023-05-10T10:00:00Z',
    },
    {
      id: 'comment-2',
      user: {
        id: 'user-789',
        name: '评论用户2',
        image: 'https://example.com/avatar2.jpg',
      },
      content: '非常实用',
      createdAt: '2023-05-11T11:00:00Z',
    },
  ],
  user: {
    id: 'user-123',
    name: '作品创建者',
    image: 'https://example.com/creator.jpg',
  },
  img: 'https://example.com/form-detail.jpg',
  createdAt: '2023-05-01T12:00:00Z',
  updatedAt: '2023-05-02T13:00:00Z',
  data: {
    form: {
      title: '表单标题',
      items: [
        { id: 'item-1', label: '项目1', type: 'text' },
        { id: 'item-2', label: '项目2', type: 'select' },
      ],
    },
  },
  // 为类型兼容添加的属性
  userId: 'user-123',
  created_at: '2023-05-01T12:00:00Z',
  updated_at: '2023-05-02T13:00:00Z',
  explanation: '作品说明',
  relativeTheme: 'theme-1',
  tags: 'tag1,tag2',
  type: 'template',
  relativeMaterial: 'material-1',
  isPrivate: false,
  isDelete: false,
  status: 'published',
  username: '测试用户',
  userAvatar: 'https://example.com/avatar.jpg',
  material: {},
  board: {
    id: 'board-1',
    image: 'https://example.com/board-image.jpg',
  },
  profiles: {
    id: 'user-123',
    name: '作品创建者',
    image: 'https://example.com/creator.jpg',
  },
  isUpvote: false,
  isCollect: false,
};

// 模板类型的测试数据
const templateShowData = {
  id: 'template-1',
  title: '测试模板',
  type: 'template',
  profiles: {
    id: 'user-1',
    name: '测试用户',
    image: 'https://example.com/test-image.jpg',
  },
  created_at: '2023-01-01T00:00:00Z',
  tags: 'tag1,tag2,tag3',
  board: {
    id: 'board-1',
    image: 'https://example.com/test-board-image.jpg',
  },
  upvotes: [],
  answers: [],
};

// 素材类型的测试数据
const materialShowData = {
  id: 'material-1',
  title: '测试素材',
  type: 'material',
  profiles: {
    id: 'user-1',
    name: '测试用户',
    image: 'https://example.com/test-image.jpg',
  },
  created_at: '2023-01-01T00:00:00Z',
  tags: 'tag1,tag2,tag3',
  material: {
    id: 'material-id-1',
    options: JSON.stringify({ test: 'data' }),
  },
  upvotes: [],
  answers: [],
};

// 模拟作品数据
const mockFormData = {
  id: 'form-123',
  title: '测试表单',
  description: '这是一个测试表单',
  data: {
    form: {
      title: '表单标题',
      description: '表单描述',
      items: [
        {
          id: 'item-1',
          type: 'text',
          label: '文本项',
          placeholder: '请输入文本',
          required: true,
        },
        {
          id: 'item-2',
          type: 'select',
          label: '选择项',
          options: ['选项1', '选项2', '选项3'],
          required: false,
        },
      ],
    },
  },
};

describe('表单功能测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟useQuery返回值
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe('创建新作品测试', () => {
    it('应该正确渲染创建新作品页面', () => {
      render(<CreateShow />);

      // 检查标题
      expect(screen.getByText('创建新作品')).toBeInTheDocument();

      // 检查表单输入项
      expect(screen.getByPlaceholderText('作品标题')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('作品描述')).toBeInTheDocument();

      // 检查提交按钮
      expect(screen.getByRole('button', { name: /创建/ })).toBeInTheDocument();
    });

    it('应该能够填写表单并创建新作品', async () => {
      const mockCreateForm = vi.fn();
      vi.mocked(useFormueHooks.useFormCreate).mockReturnValue({
        mutate: mockCreateForm,
        isPending: false,
      } as any);

      render(<CreateShow />);

      // 填写表单
      const titleInput = screen.getByPlaceholderText('作品标题');
      const descriptionInput = screen.getByPlaceholderText('作品描述');

      fireEvent.change(titleInput, { target: { value: '新作品标题' } });
      fireEvent.change(descriptionInput, { target: { value: '新作品描述' } });

      // 提交表单
      const submitButton = screen.getByRole('button', { name: /创建/ });
      fireEvent.click(submitButton);

      // 验证创建函数被调用
      await waitFor(() => {
        expect(mockCreateForm).toHaveBeenCalledWith(
          {
            json: {
              title: '新作品标题',
              description: '新作品描述',
              data: expect.anything(),
            },
          },
          expect.anything(),
        );
      });
    });
  });

  describe('编辑作品测试', () => {
    it('应该正确渲染编辑作品页面', () => {
      vi.mocked(useFormueHooks.useFormShow).mockReturnValue({
        data: mockFormData,
        isLoading: false,
      } as any);

      render(<Form userId="12313123" />);

      // 检查标题
      expect(screen.getByText('编辑表单')).toBeInTheDocument();
    });
  });
});

describe('用户作品项测试', () => {
  const mockLike = vi.fn();
  const mockCollection = vi.fn();
  const mockCopy = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockNavigate,
    } as any);

    vi.mocked(useFormueHooks.useFormCopy).mockReturnValue({
      mutate: mockCopy,
      isPending: false,
    } as any);

    vi.mocked(useFormueHooks.useFormUpvote).mockReturnValue({
      mutate: mockLike,
      isPending: false,
    } as any);

    vi.mocked(useFormueHooks.useFormCollect).mockReturnValue({
      mutate: mockCollection,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('应该正确渲染作品项', () => {
    render(<FormueItem item={mockFormueData as any} />);

    // 检查基本信息展示
    expect(screen.getByText('测试作品详情')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试作品的详细描述')).toBeInTheDocument();
    expect(screen.getByText('作品创建者')).toBeInTheDocument();
  });
});

describe('FormueMain组件', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as any);

    vi.mocked(useGetFormue).mockReturnValue({
      formueLoading: false,
    } as any);
  });

  it('应该正确渲染FormueMain组件', () => {
    render(<FormueMain />);

    expect(screen.getByText('分享你的模板和素材')).toBeInTheDocument();
    expect(screen.getByText('发布新帖')).toBeInTheDocument();
    expect(screen.getByTestId('formue-list')).toBeInTheDocument();
  });
});

describe('ShowHead组件', () => {
  // 创建模拟引用
  const remarkRef = { current: document.createElement('div') };

  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('应该正确渲染作品头部信息', () => {
    render(<ShowHead showData={templateShowData as any} remarkRef={remarkRef} />);

    expect(screen.getByText('测试模板')).toBeInTheDocument();
    expect(screen.getByText(/发布时间:/)).toBeInTheDocument();
  });
});

describe('ShowOption组件', () => {
  const mockShow = {
    id: 'test-id',
    title: '测试作品',
    isUpvote: false,
    isCollect: false,
    upvotes: [],
    collections: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染点赞和收藏按钮', () => {
    render(<ShowOption showData={mockShow as any} id="test-id" />);

    expect(screen.getByText('点赞')).toBeInTheDocument();
    expect(screen.getByText('收藏')).toBeInTheDocument();
  });
});

describe('作品详情页测试', () => {
  const mockAddComment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFormueHooks.useFormComment).mockReturnValue({
      mutate: mockAddComment,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('应该正确渲染作品详情页', () => {
    render(<ShowPage id="form-123" />);

    // 检查基本组件是否正确渲染
    expect(screen.getByTestId('show-head')).toBeInTheDocument();
    expect(screen.getByTestId('show-main')).toBeInTheDocument();
    expect(screen.getByTestId('show-footer')).toBeInTheDocument();
  });

  it('应该显示作品评论列表', () => {
    render(<ShowOption showData={mockFormueData as any} id="form-123" />);

    // 检查评论内容是否显示
    expect(screen.getByText('很棒的作品！')).toBeInTheDocument();
    expect(screen.getByText('非常实用')).toBeInTheDocument();

    // 检查评论者信息
    expect(screen.getByText('评论用户1')).toBeInTheDocument();
    expect(screen.getByText('评论用户2')).toBeInTheDocument();
  });

  it('应该能够添加新评论', async () => {
    render(<ShowOption showData={mockFormueData as any} id="form-123" />);

    // 找到评论输入框
    const commentInput = screen.getByPlaceholderText('添加评论...');
    fireEvent.change(commentInput, { target: { value: '这是一条新评论' } });

    // 点击发送按钮
    const sendButton = screen.getByRole('button', { name: /发送/ });
    fireEvent.click(sendButton);

    // 验证评论函数被调用
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith(
        {
          json: {
            id: 'form-123',
            content: '这是一条新评论',
          },
        },
        expect.anything(),
      );
    });
  });
});
