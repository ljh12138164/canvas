import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  createJebtWorkspace,
  deleteJebtWorkspace,
  getJebtWorkspace,
  refreshJebtWorkspace,
  updateJebtWorkspace,
} from '../../../server/jebt/board';
import { z } from 'zod';
import to from 'await-to-js';
const board = new Hono()
  .post(
    '/create',
    zValidator(
      'form',
      z.object({ name: z.string(), file: z.any(), userId: z.string() })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { userId, name, file } = body;
      const [error, workspace] = await to(
        createJebtWorkspace({
          name: name as string,
          userId: userId as string,
          file,
        })
      );
      if (error) return c.json(error);
      return c.json(workspace);
    }
  )
  .patch(
    '/update',
    zValidator(
      'form',
      z.object({
        id: z.string(),
        name: z.string(),
        file: z.any(),
        userId: z.string(),
        oldImageUrl: z.string(),
      })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { id, name, file, userId, oldImageUrl } = body;
      const [error, workspace] = await to(
        updateJebtWorkspace({
          id: id as string,
          name: name as string,
          userId: userId as string,
          file,
          oldImageUrl: oldImageUrl as string,
        })
      );
      if (error) return c.json(error);
      return c.json(workspace);
    }
  ) // 参数请求
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({ id: z.string().min(1, { message: 'userID不能为空' }) })
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const [error, workspace] = await to(getJebtWorkspace(id));
      console.log(workspace, error);
      if (error) return c.json(error);
      return c.json(workspace);
    }
  )
  .delete(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().min(1, { message: 'userID不能为空' }),
      })
    ),
    zValidator(
      'json',
      z.object({ userId: z.string().min(1, { message: 'userID不能为空' }) })
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const { userId } = c.req.valid('json');

      const [error, workspace] = await to(deleteJebtWorkspace(id, userId));
      if (error) return c.json(error);
      return c.json(workspace);
    }
  )
  .post(
    '/refresh',
    zValidator(
      'json',
      z.object({
        id: z.string().min(1, { message: 'id不能为空' }),
        userId: z.string().min(1, { message: 'userID不能为空' }),
      })
    ),
    async (c) => {
      const { id, userId } = c.req.valid('json');
      const [error, workspace] = await to(refreshJebtWorkspace(id, userId));
      if (error) return c.json(error);
      return c.json(workspace);
    }
  );
export default board;
