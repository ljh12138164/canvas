import { to } from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getDashboardData } from '../../../server/form/board';

export const dashboard = new Hono()
  .use(checkToken(process.env.SUPABASE_FORM_JWT!))
  .get('/dashboard', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, result] = await to(getDashboardData({ token, userId: auth.sub }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  });
