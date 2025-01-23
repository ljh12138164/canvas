import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createShow, getRandomShow, getShow } from '../../../server/design/show/index';

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
        image: z.string().optional(),
        title: z.string(),
        content: z.string(),
        tap: z.string().optional(),
        json: z.string(),
        relativeTheme: z.string(),
      }),
    ),
    async (c) => {
      const { title, content, tap, json, relativeTheme, image } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createShow({
          title,
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

const showPublic = new Hono()
  .get(
    '/getRandom',
    zValidator(
      'query',
      z.object({ tap: z.string().optional(), page: z.coerce.number().optional() }),
    ),
    async (c) => {
      const { tap, page } = c.req.valid('query');
      const [error, data] = await to(getRandomShow({ tap: tap || '', page: page || 1 }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .get('/get', zValidator('query', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('query');
    const [error, data] = await to(getShow(id));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });

export { show, showPublic };
