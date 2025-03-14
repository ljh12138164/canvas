import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
import {
  deleteJebtUser,
  getJebtUserList,
  updateJebtUserRole,
  updatePassword,
  updateUser,
} from '../../../server/jebt/user';
// import { getJebtUserList } from "../../../server/jebt/user";
const user = new Hono()
  // 获取工作区成员列表
  .get('/list', zValidator('query', z.object({ workspaceId: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { workspaceId } = c.req.valid('query');
    const [error, data] = await to(getJebtUserList(workspaceId, auth.sub, token));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 修改用户角色
  .post(
    '/update',
    zValidator(
      'json',
      z.object({
        role: z.enum(['admin', 'member']),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { role, workspaceId } = c.req.valid('json');
      const [error, data] = await to(
        updateJebtUserRole({ workspaceId, userId: auth.sub, role, currentUserId: auth.sub, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 删除用户
  .delete(
    '/delete',
    zValidator(
      'json',
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { workspaceId } = c.req.valid('json');
      const [error, data] = await to(
        deleteJebtUser({ userId: auth.sub, workspaceId, currentUserId: auth.sub, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 更新用户信息
  .post(
    '/update',
    zValidator(
      'json',
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
      }),
    ),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { name, image } = c.req.valid('json');
      const [error, data] = await to(updateUser({ token, id: auth.sub!, name, image }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 更新用户密码
  .post('/password', zValidator('json', z.object({ password: z.string() })), async (c) => {
    const { auth } = getSupabaseAuth(c);
    const { password } = c.req.valid('json');
    const [error, data] = await to(updatePassword({ password, userId: auth.sub! }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });

export default user;
