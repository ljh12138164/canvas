import to from 'await-to-js';
import { Hono } from 'hono';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createBoard, getBoard } from '../../../server/form/board';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';

export const board = new Hono()
  .use(checkToken(process.env.SUPABASE_FORM_JWT!))
  .get('/form', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, result] = await to(
      getBoard({
        token,
        userId: auth.sub,
      })
    );
    if (error) return c.json(error.message, errorCheck(error));
    return c.json(result);
  })
  .post(
    '/form',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        description: z.string().optional(),
        schema: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const [error, result] = await to(
        createBoard({
          token,
          userId: auth.sub,
          name: c.req.valid('json').name,
          description: c.req.valid('json').description ?? '',
          schema: c.req.valid('json').schema,
        })
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json(result);
    }
  );
