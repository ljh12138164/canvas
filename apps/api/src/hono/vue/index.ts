import { Hono } from 'hono';
export const vue = new Hono().get('/abc', (c) => {
  return c.json({ message: 'Hello World' });
});
