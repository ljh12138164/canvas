import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { cancelCollection, collection } from '../../../server/design/collection';

export const collections = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 收藏
  .post(
    '/collection',
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
        collection({
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
    '/delte',
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
        cancelCollection({
          token,
          id: showId,
          userId: auth.sub,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
