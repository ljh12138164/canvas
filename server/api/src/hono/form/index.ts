import { Hono } from 'hono';

export const form = new Hono().get('/abc', (c) => {
  return c.json('sdf');
});
