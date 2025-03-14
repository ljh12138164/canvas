import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createUserTap, deleteUserTap, editUserTap, getUserTap } from '../../../server/design/tap';

const tap = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取用户的标签
  .get('/userTap', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserTap({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 创建标签
  .post(
    '/create',
    zValidator('json', z.object({ tag: z.string(), userId: z.string() })),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { tag } = c.req.valid('json');
      const [error, data] = await to(createUserTap({ userId: auth.sub, token, tag }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 编辑标签
  .patch('/edit', zValidator('json', z.object({ id: z.string(), tag: z.string() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { id, tag } = c.req.valid('json');
    const [error, data] = await to(editUserTap({ userId: auth.sub, token, id, tag }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 删除标签
  .delete('/delete', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { id } = c.req.valid('json');
    const [error, data] = await to(deleteUserTap({ userId: auth.sub, token, id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
export default tap;
