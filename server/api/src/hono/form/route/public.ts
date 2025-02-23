import to from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { getSeo } from '../../../server/form/board';

export const publicSeo = new Hono().get('/seo', async (c) => {
  const [error, result] = await to(getSeo());
  if (error) return c.json({ message: error.message }, errorCheck(error));
  return c.json(result);
});
