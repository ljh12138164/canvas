import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { createFile } from '../../../server/jebt/stoage';
import { z } from 'zod';

export const storage = new Hono().post(
  '/create',
  zValidator(
    'form',
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      type: z.string(),
      size: z.number(),
      file: z.instanceof(File),
      workspaceId: z.string(),
      userId: z.string(),
    })
  ),
  async (c) => {
    const { name, description, type, file, workspaceId, userId, size } =
      c.req.valid('form');
    const [error, data] = await to(
      createFile({ file, name, description, type, workspaceId, userId, size })
    );
    if (error) return c.json(error.message, errorCheck(error));
    return c.json(data);
  }
);
