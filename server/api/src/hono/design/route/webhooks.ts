import { Hono } from 'hono';

export const webhooks = new Hono().post('/save', async (c) => {
  const { document } = await c.req.json();
  console.log(document);
  return c.json({ message: 'ok' });
});
