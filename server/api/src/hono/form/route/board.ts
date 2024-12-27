import to from 'await-to-js';
import { Hono } from 'hono';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createBoard,
  deleteBoard,
  getBoard,
  updateBoard,
} from '../../../server/form/board';
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
  )
  .delete(
    '/form',
    zValidator('json', z.object({ id: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id } = c.req.valid('json');
      const [error, result] = await to(
        deleteBoard({ token, userId: auth.sub, boardId: id })
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json(result);
    }
  )
  .patch(
    '/form',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        schema: z.string().optional(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, name, description, schema } = c.req.valid('json');
      const [error, result] = await to(
        updateBoard({
          token,
          userId: auth.sub,
          boardId: id,
          name,
          description,
          schema,
        })
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json(result);
    }
  );
