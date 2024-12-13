import { Hono } from 'hono';

export const createForm = new Hono().get('/abc', (c) => {
  return c.json('sdf');
});
