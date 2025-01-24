import type { Context, MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

export interface Payload {
  // 签发者
  iss: string;
  // 用户唯一标识
  sub: string;
  // 受众
  aud: string;
  // 过期时间
  exp: number;
  // 签发时间
  iat: number;
  // 用户信息
  user_metadata: {
    sub: string;
    [key: string]: any;
  };
  // 角色
  role: string;
  // 认证方法
  amr: [{ method: string; timestamp: number }];
  // 会话ID
  session_id: string;
  // 是否匿名
  is_anonymous: boolean;
  // 认证级别
  aal: string;
  // 邮箱
  email: string;
  // 电话
  phone: string;
  // 电话验证
}
interface SupabaseAuth {
  auth: Payload;
  token: string;
}
declare module 'hono' {
  interface ContextVariableMap {
    supabaseAuth: SupabaseAuth;
  }
}
/**
 * ## 获取supabaseAuth
 * @param c
 * @returns
 */
export const getSupabaseAuth = (c: Context) => {
  return c.get('supabaseAuth');
};

export const checkToken = (supabase: string): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const secret = supabase;
      const token = c.req.header('Authorization');

      if (!token) return c.json({ message: 'token is required' }, 401);
      const jwt = token.split(' ').at(-1);
      if (!jwt) return c.json({ message: 'token is invalid' }, 401);

      const payload = await verify(jwt, secret);
      c.set('supabaseAuth', { auth: payload as any as Payload, token: jwt });
      await next();
    } catch (e) {
      return c.json({ message: 'jwt is invalid' }, 401);
    }
  };
};
