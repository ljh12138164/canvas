import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createFile } from '../../../server/note/file';

export const file = new Hono().use(checkToken(process.env.SUPABASE_NOTE_JWT!)).post(
  '/createFile',
  zValidator(
    'json',
    z.object({
      title: z.string(),
      inconId: z.string(),
      workspaceId: z.string(),
      content: z.string(),
      folderId: z.string(),
    }),
  ),
  async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { title, inconId, workspaceId, content, folderId } = c.req.valid('json');
    const [error, result] = await to(
      createFile({
        token,
        title,
        inconId,
        workspaceId,
        content,
        userId: auth.sub,
        folderId,
      }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));

    return c.json(result);
  },
);
