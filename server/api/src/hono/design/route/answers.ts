import { zValidator } from '@hono/zod-validator';
import { to } from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createAnswer, getAnswers } from '../../../server/design/answers';

export const answers = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  .post(
    '/create',
    zValidator('json', z.object({ content: z.string(), id: z.string() })),
    async (c) => {
      const { content, id } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(createAnswer({ content, token, userId: auth.sub, id }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .get('/comment', zValidator('query', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('query');
    const { token } = getSupabaseAuth(c);
    const [error, data] = await to(getAnswers({ token, id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
