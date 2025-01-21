import { Hono } from 'hono';
export const editor = new Hono()
  .get('/test', (c) =>
    c.json({
      message: 'suceess',
    }),
  )
  .post('/create', (c) => {
    return c.json({ message: 'Hello World' });
  });
