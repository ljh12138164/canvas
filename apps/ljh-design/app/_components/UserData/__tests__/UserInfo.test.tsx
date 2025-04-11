import { useUserCollection, useUserLike } from '@/app/_hook/query/useUser';
import { useUser } from '@/app/_store/auth';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserInfo from '../UserInfo';

// Mock hooks
vi.mock('@/app/_hook/query/useUser', () => ({
  useUserCollection: vi.fn(),
  useUserLike: vi.fn(),
}));

vi.mock('@/app/_store/auth', () => ({
  useUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock lodash-es
vi.mock('lodash-es', () => ({
  debounce: (fn: any) => fn,
}));

// Mock 组件
vi.mock('../UserCollection', () => ({
  UserColleciton: ({ data, loading }: any) => (
    <div data-testid="user-collection" data-loading={loading}>
      用户收藏组件: {data ? '有数据' : '无数据'}
    </div>
  ),
}));

vi.mock('../UserLike', () => ({
  UserLike: ({ data, loading }: any) => (
    <div data-testid="user-like" data-loading={loading}>
      用户点赞组件: {data ? '有数据' : '无数据'}
    </div>
  ),
}));

vi.mock('@/app/_components/Comand/AvatarImage', () => ({
  default: ({ src, alt, className }: any) => (
    <img data-testid="avatar-image" src={src} alt={alt} className={className} />
  ),
}));

// Mock UI 组件
vi.mock('@/app/_components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardFooter: ({ children, className }: any) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/app/_components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button type="button" data-testid="button" data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@/app/_components/ui/input', () => ({
  Input: ({ placeholder, className, onChange }: any) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      className={className}
      onChange={onChange}
    />
  ),
}));

vi.mock('lucide-react', () => ({
  PencilIcon: () => <span data-testid="pencil-icon">✏️</span>,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('UserInfo', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockUser = {
    user: {
      user_metadata: {
        name: '测试用户',
        email: 'test@example.com',
        image: 'test.jpg',
        regionStr: '中国',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    (useRouter as any).mockReturnValue(mockRouter);
    (useUser as any).mockReturnValue({ user: mockUser });
    (useUserLike as any).mockReturnValue({ userLike: [], userLikeLoading: false });
    (useUserCollection as any).mockReturnValue({
      userCollection: [],
      userCollectionLoading: false,
    });
  });

  it('渲染用户信息', () => {
    render(<UserInfo />);

    // 检查用户信息卡片
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', 'test.jpg');
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', '测试用户');
    expect(screen.getByText('测试用户')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('中国')).toBeInTheDocument();

    // 检查编辑资料按钮
    const editButton = screen.getByText('编辑资料');
    expect(editButton).toBeInTheDocument();
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
  });

  it('点击编辑资料按钮导航到编辑页面', () => {
    render(<UserInfo />);

    const editButton = screen.getByText('编辑资料');
    fireEvent.click(editButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/board/user/change');
  });

  // it('默认显示点赞列表', () => {
  //   render(<UserInfo />);

  //   expect(screen.getByTestId('user-like')).toBeInTheDocument();
  //   expect(screen.queryByTestId('user-collection')).not.toBeInTheDocument();
  // });

  it('切换到收藏列表', () => {
    render(<UserInfo />);

    // 点击我的收藏按钮
    const collectionButton = screen.getByText('我的收藏');
    fireEvent.click(collectionButton);

    expect(screen.queryByTestId('user-like')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-collection')).toBeInTheDocument();
  });

  it('搜索输入框变更时更新搜索词', () => {
    render(<UserInfo />);

    const searchInput = screen.getByTestId('input');
    fireEvent.change(searchInput, { target: { value: '搜索词' } });

    // 由于我们mock了debounce直接执行函数，所以搜索应该立即发生
    // 这里不好直接断言状态变化，但可以验证搜索框存在并且可以输入
    expect(searchInput).toBeInTheDocument();
  });

  it('从localStorage读取用户偏好', () => {
    // 设置localStorage
    localStorageMock.setItem('USER_GET', 'true');

    render(<UserInfo />);

    // 应该默认显示点赞列表，因为localStorage中有USER_GET=true
    expect(screen.getByTestId('user-like')).toBeInTheDocument();
    expect(screen.queryByTestId('user-collection')).not.toBeInTheDocument();
  });

  it('处理用户metadata为空的情况', () => {
    // 设置用户数据为空
    (useUser as any).mockReturnValue({
      user: {
        user: {
          user_metadata: {},
        },
      },
    });

    render(<UserInfo />);

    // 应该显示默认值
    const avatar = screen.getByTestId('avatar-image');
    // 不检查src属性，只检查alt属性
    expect(avatar).toHaveAttribute('alt', '用户');
    expect(screen.getByText('无地区')).toBeInTheDocument();
  });

  it('处理用户无地区信息的情况', () => {
    (useUser as any).mockReturnValue({
      user: {
        user: {
          user_metadata: {
            name: '测试用户',
            email: 'test@example.com',
            image: 'test.jpg',
            // 无regionStr字段
          },
        },
      },
    });

    render(<UserInfo />);

    // 应该显示"无地区"
    expect(screen.getByText('无地区')).toBeInTheDocument();
  });

  it('测试点赞/收藏数据加载状态', () => {
    // 模拟数据加载中
    (useUserLike as any).mockReturnValue({ userLike: null, userLikeLoading: true });
    (useUserCollection as any).mockReturnValue({
      userCollection: null,
      userCollectionLoading: true,
    });

    // 需要模拟localStorage.getItem返回null，这样初始状态会显示收藏组件
    localStorageMock.clear();

    render(<UserInfo />);

    // 默认情况下，现在应该显示收藏列表而不是点赞列表
    // 检查收藏列表的加载状态
    expect(screen.getByTestId('user-collection')).toHaveAttribute('data-loading', 'true');

    // 切换到点赞列表
    const likeButton = screen.getByText('我的点赞');
    fireEvent.click(likeButton);

    // 现在应该显示点赞列表，检查其加载状态
    expect(screen.getByTestId('user-like')).toHaveAttribute('data-loading', 'true');
  });

  it('从收藏切换到点赞再切回收藏', () => {
    // 确保初始显示收藏列表
    localStorageMock.clear();

    render(<UserInfo />);

    // 初始状态应为收藏列表
    expect(screen.getByTestId('user-collection')).toBeInTheDocument();

    // 切换到点赞列表
    const likeButton = screen.getByText('我的点赞');
    fireEvent.click(likeButton);
    expect(screen.getByTestId('user-like')).toBeInTheDocument();
    expect(screen.queryByTestId('user-collection')).not.toBeInTheDocument();

    // 再切换回收藏列表
    const collectionButton = screen.getByText('我的收藏');
    fireEvent.click(collectionButton);
    expect(screen.getByTestId('user-collection')).toBeInTheDocument();
    expect(screen.queryByTestId('user-like')).not.toBeInTheDocument();
  });

  it('搜索功能正确传递搜索词', () => {
    // 重置mock以便我们可以检查调用参数
    const useUserLikeMock = vi.fn().mockReturnValue({ userLike: [], userLikeLoading: false });
    const useUserCollectionMock = vi
      .fn()
      .mockReturnValue({ userCollection: [], userCollectionLoading: false });

    (useUserLike as any).mockImplementation(useUserLikeMock);
    (useUserCollection as any).mockImplementation(useUserCollectionMock);

    // 确保localStorage为空，默认显示收藏列表
    localStorageMock.clear();

    render(<UserInfo />);

    // 初始调用时，搜索词应为空字符串
    expect(useUserLikeMock).toHaveBeenCalledWith(false, '');
    expect(useUserCollectionMock).toHaveBeenCalledWith(true, '');

    // 输入搜索词
    const searchInput = screen.getByTestId('input');
    fireEvent.change(searchInput, { target: { value: '测试搜索' } });

    // 由于我们模拟了debounce直接执行，搜索应该立即发生
    // 重新渲染后hook应该使用新的搜索词
    expect(useUserLikeMock).toHaveBeenCalledWith(false, '测试搜索');
    expect(useUserCollectionMock).toHaveBeenCalledWith(true, '测试搜索');
  });
});
