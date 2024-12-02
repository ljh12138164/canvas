import { Hono } from 'hono';
export const editor = new Hono().get('/', (c) => {
  console.log(c);
  if (c.req.header('token') !== '459824aaffa928e05f5b1caec411ae5f') {
    return c.text('认证失败');
  }
  return c.json({
    message: 'suceess',
  });
});
