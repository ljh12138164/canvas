import { Hono } from 'hono';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import to from 'await-to-js';
import { createWorkspace } from '../../../server/note/workspace';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const workspace = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  // 获取工作区
  .get('/', async (c) => {
    return c.json({ message: 'hello' });
  })
  // 创建工作区
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        inconId: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { name, inconId } = c.req.valid('json');
      const [error, workspace] = await to(
        createWorkspace({
          userId: auth.user_metadata.sub,
          name,
          inconId,
          token,
        })
      );
      if (error) return c.json({ message: '服务器错误' }, 500);
      return c.json(workspace);
    }
  );

export { workspace };
