import { Hono } from 'hono';

const show = new Hono().get('/', async (c) => {
  return c.json({
    message: 'Hello World',
  });
});
export default show;
