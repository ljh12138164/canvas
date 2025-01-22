import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createShow } from '../../../server/design/show/index';

const show = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  .get('/', async (c) => {
    return c.json({
      message: 'Hello World',
    });
  })
  // 创建评论
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        content: z.string(),
        tap: z.string().optional(),
        json: z.string(),
        image: z.string().optional(),
        relativeTheme: z.string(),
      }),
    ),
    async (c) => {
      const { content, tap, json, image, relativeTheme } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createShow({
          content,
          tap: tap || '',
          token,
          userId: auth.sub,
          json,
          image: image || '',
          relativeTheme,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );

export default show;
