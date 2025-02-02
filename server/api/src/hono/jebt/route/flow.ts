import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
import { createFlow, deleteJebtFlow, getJebtFlow, updateJebtFlow } from '../../../server/jebt/flow';

export const flow = new Hono()
  .post(
    '/create',
    zValidator(
      'form',
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { name, description, workspaceId } = c.req.valid('form');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        createFlow({
          name,
          description,
          workspaceId,
          userId: auth.sub,
          token,
        }),
      );

      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .get('/list', zValidator('query', z.object({ workspaceId: z.string() })), async (c) => {
    const { workspaceId } = c.req.valid('query');
    const { token, auth } = getSupabaseAuth(c);
    const [error, data] = await to(
      getJebtFlow({
        workspaceId: workspaceId,
        userId: auth.sub,
        token,
      }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { id, workspaceId } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(deleteJebtFlow({ id, userId: auth.sub, workspaceId, token }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .patch(
    '/update',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        workspaceId: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    ),
    async (c) => {
      const { id, workspaceId, name, description } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        updateJebtFlow({ id, userId: auth.sub, workspaceId, name, description, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
