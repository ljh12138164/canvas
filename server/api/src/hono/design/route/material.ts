import { to } from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getMaterial } from '../../../server/design/material';

export const material = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  .get('/material', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getMaterial({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
