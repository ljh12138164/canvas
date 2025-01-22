import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import {
  createFile,
  deleteJebtFile,
  getJebtFileList,
  updateJebtFile,
} from '../../../server/jebt/stoage';

export const storage = new Hono()
  .post(
    '/create',
    zValidator(
      'form',
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.string(),
        size: z.string(),
        file: z.any(),
        workspaceId: z.string(),
        userId: z.string(),
      }),
    ),
    async (c) => {
      const { name, description, type, file, workspaceId, userId, size } = c.req.valid('form');
      if (!file) throw new Error('未选择文件');
      const [error, data] = await to(
        createFile({
          file,
          name,
          description,
          type,
          workspaceId,
          userId,
          size: +size,
        }),
      );

      if (error) return c.json(error.message, errorCheck(error));
      return c.json(data);
    },
  )
  .get(
    '/list',
    zValidator('query', z.object({ workspaceId: z.string(), userId: z.string() })),
    async (c) => {
      const { workspaceId, userId } = c.req.valid('query');
      const [error, data] = await to(
        getJebtFileList({
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
        file: z.string(),
      }),
    ),
    async (c) => {
      const { id, userId, workspaceId, file } = c.req.valid('json');
      const [error, data] = await to(deleteJebtFile({ id, userId, workspaceId, file }));
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
        updateJebtFile({ id, userId, workspaceId, name, description }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
