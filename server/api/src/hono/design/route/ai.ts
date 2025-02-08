import { zValidator } from '@hono/zod-validator';
import { to } from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createChatSession,
  deleteChatSession,
  getChatHistory,
  getChatSession,
  saveChatSession,
} from '../../../server/design/ai';
export const ai = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  //   创建AI会话
  .post('/create', zValidator('json', z.object({ name: z.string() })), async (c) => {
    const { name } = await c.req.json();
    const { token, auth } = getSupabaseAuth(c);
    const [error, data] = await to(createChatSession({ name, token, userId: auth.sub }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  //   获取AI会话
  .get('/chat', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, data] = await to(getChatSession({ token, userId: auth.sub }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  //   删除AI会话
  .delete('/chat', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('json');
    const { token, auth } = getSupabaseAuth(c);
    const [error, data] = await to(deleteChatSession({ token, userId: auth.sub, id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  //   保存AI会话
  .post(
    '/save',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        history: z.array(
          z.object({
            role: z.string(),
            parts: z.array(z.object({ text: z.string() })),
            type: z.enum(['text', 'image']),
          }),
        ),
      }),
    ),
    async (c) => {
      const { id, history } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(saveChatSession({ token, userId: auth.sub, id, history }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .get('/history', zValidator('query', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('query');
    const { token, auth } = getSupabaseAuth(c);
    const [error, data] = await to(getChatHistory({ token, userId: auth.sub, id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
