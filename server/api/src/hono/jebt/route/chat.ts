import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { getSupabaseAuth } from '../../../libs/middle';
import { getChatMessage, sendChatMessage, uploadImage } from '../../../server/jebt/chat';

export const chat = new Hono()
  // 分页获取消息
  .get(
    '/message',
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        pageTo: z.string(),
      }),
    ),
    async (c) => {
      const { workspaceId, pageTo } = c.req.valid('query');
      const { token, auth } = getSupabaseAuth(c);
      const [error, messages] = await to(
        getChatMessage(workspaceId, auth.sub, Number.isNaN(+pageTo) ? 0 : +pageTo, token),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ messages });
    },
  )
  // 发送消息q
  .post(
    '/send',
    zValidator(
      'json',
      z.object({
        workspaceId: z.string(),
        message: z.string(),
      }),
    ),
    async (c) => {
      const { workspaceId, message } = c.req.valid('json');
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(sendChatMessage(workspaceId, auth.sub, message, token));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: data });
    },
  )
  .post(
    '/file',
    zValidator(
      'form',
      z.object({
        file: z.any(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { file, workspaceId } = c.req.valid('form');
      if (!file) return c.json({ message: '文件不能为空' }, 400);
      const { token, auth } = getSupabaseAuth(c);
      const [error, data] = await to(
        uploadImage(workspaceId as string, auth.sub, file as File, token),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: data });
    },
  );
