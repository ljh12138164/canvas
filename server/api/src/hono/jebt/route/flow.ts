import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
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
        userId: z.string(),
      }),
    ),
    async (c) => {
      const { name, description, workspaceId, userId } = c.req.valid('form');
      const [error, data] = await to(
        createFlow({
          name,
          description,
          workspaceId,
          userId,
        }),
      );

      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .get(
    '/list',
    zValidator('query', z.object({ workspaceId: z.string(), userId: z.string() })),
    async (c) => {
      const { workspaceId, userId } = c.req.valid('query');
      const [error, data] = await to(
        getJebtFlow({
          workspaceId: workspaceId,
          userId,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        userId: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { id, userId, workspaceId } = c.req.valid('json');
      const [error, data] = await to(deleteJebtFlow({ id, userId, workspaceId }));
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
        userId: z.string(),
        workspaceId: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    ),
    async (c) => {
      const { id, userId, workspaceId, name, description } = c.req.valid('json');
      const [error, data] = await to(
        updateJebtFlow({ id, userId, workspaceId, name, description }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
