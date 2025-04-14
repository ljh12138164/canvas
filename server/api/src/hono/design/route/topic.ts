import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { deleteUserTopic, editUserTopic, getUserTopic } from '../../../server/design/topic';
// 获取用户话题
const topic = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取用户话题
  .get('/userTopic', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserTopic(auth.sub, token));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })

  // 编辑话题
  .post(
    '/edit',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        name: z.string(),
        explanation: z.string(),
      }),
    ),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { id, name, explanation } = c.req.valid('json');
      const [error, data] = await to(
        editUserTopic({ id, name, explanation, userId: auth.sub, token }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 删除话题
  .post('/delete', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { id } = c.req.valid('json');
    const [error, data] = await to(deleteUserTopic(id, auth.sub, token));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
// 获取用户模板

export default topic;
