import type { Sessions } from '@/app/_types/user';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUser } from '../auth';

describe('useUser Store', () => {
  // 创建一个模拟的 Sessions 对象，使用类型断言
  const createMockSession = (): Sessions => {
    return {
      user: {
        id: '1',
        app_metadata: {},
        user_metadata: {
          name: '测试用户',
          sub: 'sub123',
          image: 'https://example.com/avatar.jpg',
          email: 'test@example.com',
          region: 'CN',
        },
        aud: 'authenticated',
        created_at: '2023-01-01',
        role: 'authenticated',
        updated_at: '2023-01-01',
        email: 'test@example.com',
      } as any, // 使用类型断言避免详细的类型检查
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: 1234567890,
        token_type: 'bearer',
        user: { id: '1' } as any,
      } as any, // 使用类型断言避免详细的类型检查
    };
  };

  // 每次测试前重置 store 状态
  beforeEach(() => {
    useUser.setState({
      loading: true,
      user: null,
      setUser: useUser.getState().setUser,
      setLoading: useUser.getState().setLoading,
    });
  });

  it('初始状态应该是 loading=true 且 user=null', () => {
    const state = useUser.getState();
    expect(state.loading).toBe(true);
    expect(state.user).toBeNull();
  });

  it('setUser 方法应该设置用户并将 loading 设为 false', () => {
    const mockUser = createMockSession();

    // 调用 setUser 方法
    useUser.getState().setUser(mockUser);

    // 验证状态更新
    const state = useUser.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
  });

  it('setUser 方法设置 null 应该清除用户并将 loading 设为 false', () => {
    // 先设置一个用户
    const mockUser = createMockSession();
    useUser.getState().setUser(mockUser);

    // 然后清除用户
    useUser.getState().setUser(null);

    // 验证状态更新
    const state = useUser.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('setLoading 方法应该只更新 loading 状态', () => {
    // 设置初始用户状态
    const mockUser = createMockSession();
    useUser.getState().setUser(mockUser);

    // 修改 loading 状态为 true
    useUser.getState().setLoading(true);

    // 验证状态
    const state = useUser.getState();
    expect(state.loading).toBe(true);
    expect(state.user).toEqual(mockUser); // 用户不变
  });
});
