import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { getChatMessage, sendChatMessage } from '../../../server/jebt/chat';
import { z } from 'zod';

export const chat = new Hono()
  // 分页获取消息
  .get(
    '/message',
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        pageTo: z.string(),
      })
    ),
    async (c) => {
      const { workspaceId, userId, pageTo } = c.req.valid('query');
      const [error, messages] = await to(
        getChatMessage(workspaceId, userId, Number.isNaN(+pageTo) ? 0 : +pageTo)
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json({ messages });
    }
  )
  // 发送消息q
  .post(
    '/send',
    zValidator(
      'json',
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        message: z.string(),
      })
    ),
    async (c) => {
      const { workspaceId, userId, message } = c.req.valid('json');
      const [error, data] = await to(
        sendChatMessage(workspaceId, userId, message)
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json({ message: data });
    }
  );
