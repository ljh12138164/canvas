import { Hono } from 'hono';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import to from 'await-to-js';
import { errorCheck } from '../../../libs/error';
import { createFile } from '../../../server/note/file';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const file = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  .post(
    '/createFile',
    zValidator(
      'json',
      z.object({
        title: z.string(),
        inconId: z.string(),
        workspaceId: z.string(),
        content: z.string(),
        folderId: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { title, inconId, workspaceId, content, folderId } =
        c.req.valid('json');
      const [error, result] = await to(
        createFile({
          token,
          title,
          inconId,
          workspaceId,
          content,
          userId: auth.sub,
          folderId,
        })
      );
      if (error) {
        return c.json({ message: error.message }, errorCheck(error));
      }
      return c.json(result);
    }
  );
