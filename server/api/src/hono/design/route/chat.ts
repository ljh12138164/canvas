import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getChatMessage, sendChatMessage } from '../../../server/design/chat';

export const chat = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 分页获取消息
  .get(
    '/message',
    zValidator(
      'query',
      z.object({
        userId: z.string(),
        sendId: z.string(),
        pageTo: z.string(),
      }),
    ),
    async (c) => {
      const { userId, sendId, pageTo } = c.req.valid('query');
      const { token } = getSupabaseAuth(c);
      const [error, messages] = await to(
        getChatMessage(userId, sendId, Number.isNaN(+pageTo) ? 0 : +pageTo, token),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(messages);
    },
  )
  // 发送消息q
  .post(
    '/send',
    zValidator(
      'json',
      z.object({
        sendId: z.string(),
        converId: z.string(),
        type: z.enum(['message', 'url']),
        message: z.string(),
      }),
    ),
    async (c) => {
      const { sendId, message, converId, type } = c.req.valid('json');
      const { token } = getSupabaseAuth(c);
      const [error, data] = await to(
        sendChatMessage({
          token,
          sendId,
          converId,
          type,
          message,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
