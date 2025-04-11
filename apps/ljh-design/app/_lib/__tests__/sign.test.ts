import * as userDB from '@/app/_database/user';
import type { Meta, Sessions } from '@/app/_types/user';
import type { Session, User, UserMetadata } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewToken } from '../sign';

// 模拟用户数据库模块
vi.mock('@/app/_database/user', () => ({
  getCurrentUser: vi.fn(),
}));

describe('Sign 相关函数', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getNewToken 函数', () => {
    it('当用户已登录时应返回访问令牌', async () => {
      // 模拟已登录用户，创建符合 Sessions 类型的对象
      const mockMetadata: UserMetadata & Meta = {
        name: '测试用户',
        image: 'test-image.jpg',
        sub: 'auth-sub',
        email: 'test@example.com',
        region: 'cn',
      };

      const mockUser = {
        user: {
          id: 'user-id',
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: 'test@example.com',
          role: '',
          user_metadata: mockMetadata,
        } as User & { user_metadata: UserMetadata & Meta },
        session: {
          access_token: 'mock-access-token',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          refresh_token: 'mock-refresh-token',
          token_type: 'bearer',
          user: {} as User,
        } as Session,
      } as Sessions;

      vi.mocked(userDB.getCurrentUser).mockResolvedValue(mockUser);

      const token = await getNewToken();

      expect(userDB.getCurrentUser).toHaveBeenCalled();
      expect(token).toBe('mock-access-token');
    });

    it('当用户未登录时应返回 null', async () => {
      // 模拟未登录状态
      vi.mocked(userDB.getCurrentUser).mockResolvedValue(null);

      const token = await getNewToken();

      expect(userDB.getCurrentUser).toHaveBeenCalled();
      expect(token).toBeNull();
    });
  });
});
