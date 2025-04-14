import { useAddFriend, useFrident } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import type { Profiles } from '@/app/_types/user';
import { useQueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FirdentItem } from '../FirdentItem';

// 模拟React Query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

// 模拟Hooks
vi.mock('@/app/_hook/query/useFrident', () => ({
  useAddFriend: vi.fn(),
  useFrident: vi.fn(),
}));

vi.mock('@/app/_store/auth', () => ({
  useUser: vi.fn(),
}));

// 模拟Response组件
vi.mock('@/app/_components/Comand/Response', () => ({
  Response: vi.fn(({ children, myTrigger, onConfirm, ref }) => {
    if (ref) {
      ref.current = { closeModel: vi.fn() };
    }
    return (
      <div data-testid="response-dialog">
        <div data-testid="trigger-element">{myTrigger}</div>
        <div data-testid="dialog-content">{children}</div>
        {onConfirm && (
          <button type="button" data-testid="confirm-button" onClick={onConfirm}>
            确认
          </button>
        )}
      </div>
    );
  }),
}));

// 模拟AvatarImage组件
vi.mock('@/app/_components/Comand/AvatarImage', () => ({
  default: ({ userInfo }: { userInfo: Profiles }) => (
    <div data-testid="avatar">{userInfo.name}</div>
  ),
}));

// 模拟toast
vi.mock('react-hot-toast', () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  };
  return {
    default: toast,
    toast,
  };
});

describe('FirdentItem组件', () => {
  const mockProfile: Profiles = {
    id: 'user-1',
    name: '测试用户',
    email: 'test@example.com',
    image: 'test-image.jpg',
  };

  // 空的好友列表Map
  const emptyUserMap = new Map<string, Profiles>();

  // 包含用户的好友列表Map
  const friendUserMap = new Map<string, Profiles>();
  friendUserMap.set('user-1', mockProfile);

  const addFriendMock = vi.fn();
  const invalidateQueriesMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // 模拟useQueryClient
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    } as any);

    // 模拟useAddFriend
    vi.mocked(useAddFriend).mockReturnValue({
      addFriendMutate: addFriendMock,
      addFriendLoading: false,
    });

    // 默认没有好友关系
    vi.mocked(useFrident).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    // 模拟useUser
    vi.mocked(useUser).mockReturnValue({
      user: {
        user: {
          id: 'current-user-id',
        },
      },
    } as any);
  });

  it('应该正确渲染用户信息', () => {
    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    // 使用更明确的选择器
    expect(screen.getByTestId('avatar')).toHaveTextContent('测试用户');
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('如果用户不在好友列表中，应该显示添加好友按钮', () => {
    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    const addButton = screen.getByRole('button', { name: '添加好友' });
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('如果用户已在好友列表中，应该显示已经是好友状态', () => {
    render(<FirdentItem item={mockProfile} userList={friendUserMap} />);

    expect(screen.getByText('已经是好友了')).toBeInTheDocument();
    expect(screen.queryByText('添加好友')).not.toBeInTheDocument();
  });

  it('如果有待处理的好友请求（用户发起），应该显示等待对方同意', () => {
    vi.mocked(useFrident).mockReturnValue({
      data: [
        {
          id: 'friend-1',
          userId: 'current-user-id',
          adduser: 'user-1',
          isInvite: false,
          created_at: '2023-01-01',
          user_profile: {} as Profiles,
          friend_profile: {} as Profiles,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    const pendingButton = screen.getByRole('button', { name: '等待对方同意' });
    expect(pendingButton).toBeInTheDocument();
    expect(pendingButton).toBeDisabled();
  });

  it('如果有待处理的好友请求（对方发起），应该显示等待你的同意', () => {
    vi.mocked(useFrident).mockReturnValue({
      data: [
        {
          id: 'friend-1',
          userId: 'user-1',
          adduser: 'current-user-id',
          isInvite: false,
          created_at: '2023-01-01',
          user_profile: {} as Profiles,
          friend_profile: {} as Profiles,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    const pendingButton = screen.getByRole('button', { name: '等待你的同意' });
    expect(pendingButton).toBeInTheDocument();
    expect(pendingButton).toBeDisabled();
  });

  it('如果已经是好友，应该显示已经是好友状态', () => {
    vi.mocked(useFrident).mockReturnValue({
      data: [
        {
          id: 'friend-1',
          userId: 'user-1',
          adduser: 'current-user-id',
          isInvite: true, // 已确认的好友关系
          created_at: '2023-01-01',
          user_profile: {} as Profiles,
          friend_profile: {} as Profiles,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    const friendButton = screen.getByRole('button', { name: '已经是好友' });
    expect(friendButton).toBeInTheDocument();
    expect(friendButton).toBeDisabled();
  });

  it('点击添加好友按钮后确认应该调用添加好友API', () => {
    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    // 点击添加好友按钮
    const addButton = screen.getByRole('button', { name: '添加好友' });
    fireEvent.click(addButton);

    // 点击确认按钮
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    // 验证加载状态显示
    expect(toast.loading).toHaveBeenCalledWith('发起好友请求中...');

    // 验证添加好友API调用
    expect(addFriendMock).toHaveBeenCalledWith(
      { json: { addUserId: 'user-1' } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it('添加好友成功后应该刷新好友列表', () => {
    vi.mocked(useAddFriend).mockReturnValue({
      addFriendMutate: vi.fn().mockImplementation((data, options) => {
        options.onSuccess();
      }),
      addFriendLoading: false,
    });

    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    // 点击添加好友按钮
    const addButton = screen.getByRole('button', { name: '添加好友' });
    fireEvent.click(addButton);

    // 点击确认按钮
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    // 验证成功提示
    expect(toast.success).toHaveBeenCalledWith('发起好友请求成功');

    // 验证刷新好友列表
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['frident'] });
  });

  it('加载好友列表时应该禁用添加好友按钮', () => {
    vi.mocked(useFrident).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<FirdentItem item={mockProfile} userList={emptyUserMap} />);

    const addButton = screen.getByRole('button', { name: '添加好友' });
    expect(addButton).toBeDisabled();
  });
});
