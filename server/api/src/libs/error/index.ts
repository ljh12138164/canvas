import type { Context } from 'hono';

/**
 * 401错误
 * @param c 上下文
 * @returns
 */
export const error401 = (c: Context) => {
  return c.json({ message: '请先登录' }, 401);
};
/**
 * 404错误
 * @param c 上下文
 * @returns
 */
export const error404 = (c: Context) => {
  return c.json({ message: '资源不存在' }, 404);
};
/**
 * 500错误
 * @param c 上下文
 * @returns
 */
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

/**
 * 检查错误
 * @param error 错误
 * @returns
 */
export const errorCheck = (error: Error) => {
  if (error.message === '类型错误') return 400;
  if (error.message === '主题不能为空') return 400;
  if (error.message === '素材不能为空') return 400;
  if (error.message === '未找到工作区') return 404;
  if (error.message === '工作区不存在') return 404;
  if (error.message === '未找到用户') return 404;
  if (error.message === '未找到资源') return 404;
  if (error.message === '无权限') return 403;
  if (error.message === '服务器错误') return 500;
  if (error.message === '用户名或密码错误') return 401;
  if (error.message === '已加入' || error.message === '已加入工作区') return 400;

  return 400;
};
