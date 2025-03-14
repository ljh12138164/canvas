import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
import {
  createJebtWorkspace,
  deleteJebtWorkspace,
  getJebtWorkspace,
  getJebtWorkspaceByInviteCode,
  joinJebtWorkspace,
  refreshJebtWorkspace,
  updateJebtWorkspace,
} from '../../../server/jebt/board';

const board = new Hono()
  .get('/test', async (c) => {
    return c.json({ message: 'test' });
  })
  // 创建工作区
  .post(
    '/create',
    zValidator(
      'form',
      z.object({
        name: z.string(),
        file: z.any(),
        email: z.string(),
        userImage: z.string(),
        username: z.string(),
      }),
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { token, auth } = getSupabaseAuth(c);
      const { name, file, email, userImage, username } = body;
      const [error, workspace] = await to(
        createJebtWorkspace({
          name: name as string,
          userId: auth.sub,
          file,
          email: email as string,
          userImage: userImage as string,
          username: username as string,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 更新工作区
  .patch(
    '/update',
    zValidator(
      'form',
      z.object({
        id: z.string(),
        name: z.string(),
        file: z.any(),
        oldImageUrl: z.string(),
      }),
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { token, auth } = getSupabaseAuth(c);
      const { id, name, file, oldImageUrl } = body;
      const [error, workspace] = await to(
        updateJebtWorkspace({
          id: id as string,
          name: name as string,
          userId: auth.sub as string,
          file,
          oldImageUrl: oldImageUrl as string,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 获取工作区
  .get('/dashboard', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, workspace] = await to(getJebtWorkspace(auth.sub, token));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(workspace);
  })
  // 删除工作区
  .delete(
    '/dashboard',
    zValidator(
      'json',
      z.object({
        imageUrl: z.string().min(1, { message: 'imageUrl不能为空' }),
        id: z.string().min(1, { message: 'id不能为空' }),
      }),
    ),
    async (c) => {
      const { imageUrl, id } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, workspace] = await to(
        deleteJebtWorkspace({ id, userId: auth.sub, token, imageUrl }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 刷新工作区
  .post(
    '/refresh',
    zValidator(
      'json',
      z.object({
        id: z.string().min(1, { message: 'id不能为空' }),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, workspace] = await to(refreshJebtWorkspace(id, auth.sub, token));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 通过邀请码获取工作区
  .get(
    '/invite',
    zValidator(
      'param',
      z.object({
        inviteCode: z.string().min(6, { message: '邀请码不能为空' }),
      }),
    ),
    async (c) => {
      const { inviteCode } = c.req.valid('param');
      const { token } = getSupabaseAuth(c);
      const [error, workspace] = await to(getJebtWorkspaceByInviteCode(inviteCode, token));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 加入工作区
  .post(
    '/join',
    zValidator(
      'json',
      z.object({
        id: z.string().min(1, { message: 'id不能为空' }),
        email: z.string().min(1, { message: 'email不能为空' }),
        userImage: z.string().min(1, { message: 'userImage不能为空' }),
        username: z.string().min(1, { message: 'username不能为空' }),
      }),
    ),
    async (c) => {
      const { id, email, userImage, username } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, workspace] = await to(
        joinJebtWorkspace({ id, userId: auth.sub, token, email, userImage, username }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  );
export default board;
