import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createShow, getRandomShow, getSeo, getShow } from '../../../server/design/show/index';

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
        title: z.string(),
        content: z.string(),
        tap: z.string().optional(),
        relativeTheme: z.string().optional(),
        type: z.enum(['template', 'material']),
        relativeMaterial: z.string().optional(),
      }),
    ),
    async (c) => {
      const { title, content, tap, relativeTheme, type, relativeMaterial } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createShow({
          title,
          content,
          tap: tap || '',
          token,
          userId: auth.sub,
          relativeTheme,
          type,
          relativeMaterial,
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
    const secret = process.env.SUPABASE_DESIGN_JWT!;
    const token = c.req.header('Authorization');
    const { id } = c.req.valid('query');

    const jwt = token?.split(' ').at(-1);
    // 登录看有没有收藏
    if (jwt) {
      const [errors, payload] = await to(verify(jwt, secret));
      if (errors) {
        const [error, data] = await to(getShow(id));
        if (error) return c.json({ message: error.message }, errorCheck(error));
        return c.json(data);
      }

      const [error, data] = await to(getShow(id, payload.sub as string, jwt));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
    const [error, data] = await to(getShow(id));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  .get('/seo', async (c) => {
    const [error, data] = await to(getSeo());
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });

export { show, showPublic };
