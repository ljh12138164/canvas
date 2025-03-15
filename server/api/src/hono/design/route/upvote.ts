import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { cancelUpvote, upvote } from '../../../server/design/upvote';

export const upvotes = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 点赞
  .post(
    '/upvote',
    zValidator(
      'json',
      z.object({
        showId: z.string().min(1),
      }),
    ),
    async (c) => {
      const { showId } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);

      const [error, data] = await to(
        upvote({
          token,
          id: showId,
          userId: auth.sub,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .delete(
    '/cancel',
    zValidator(
      'json',
      z.object({
        showId: z.string().min(1),
      }),
    ),
    async (c) => {
      const { showId } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);

      const [error, data] = await to(
        cancelUpvote({
          token,
          id: showId,
          userId: auth.sub,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
