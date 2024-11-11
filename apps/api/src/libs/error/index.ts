import { Context } from 'hono';

export const error = (c: Context, message: string) => {
  return c.json({ message }, 400);
};

export const error401 = (c: Context) => {
  return c.json({ message: '请先登录' }, 401);
};

export const error404 = (c: Context) => {
  return c.json({ message: '资源不存在' }, 404);
};

export const error500 = (c: Context) => {
  return c.json({ message: '服务器错误' }, 500);
};
/**
 * 400错误
 * @param c 上下文
 * @param message 错误信息
 * @returns
 */
export const error400 = (c: Context, message: string) => {
  return c.json({ message }, 400);
};
