import { Hono } from 'hono';
export const jebt = new Hono().get('/', (c) => {
  return c.json({ message: 'Hello World' });
});
