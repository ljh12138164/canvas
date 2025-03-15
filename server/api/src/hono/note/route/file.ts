import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createFile,
  deleteFile,
  getFileTrash,
  restoreFile,
  softDeleteFile,
  updateFile,
} from '../../../server/note/file';

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
  )
  // 获取文件垃圾桶
  .get('/trash', zValidator('query', z.object({ workspaceId: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { workspaceId } = c.req.valid('query');
    const [error, result] = await to(
      getFileTrash({ token, workspaceId: workspaceId as string, userId: auth.sub as string }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  // 重命名
  .patch(
    '/update',
    zValidator(
      'json',
      z.object({ id: z.string(), title: z.string(), inconId: z.string(), workspaceId: z.string() }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, title, inconId, workspaceId } = c.req.valid('json');
      const [error] = await to(
        updateFile({ token, id, title, inconId, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '更新成功' });
    },
  )
  // 删除文件
  .delete(
    '/delete',
    zValidator('query', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('query');
      const [error] = await to(deleteFile({ token, id, workspaceId, userId: auth.sub as string }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '删除成功' });
    },
  )
  // 软删除文件
  .patch(
    '/delete',
    zValidator('query', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('query');
      const [error] = await to(
        softDeleteFile({ token, id, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '软删除成功' });
    },
  )
  // 恢复文件
  .patch(
    '/restore',
    zValidator('query', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('query');
      const [error] = await to(restoreFile({ token, id, workspaceId, userId: auth.sub as string }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '恢复成功' });
    },
  );
