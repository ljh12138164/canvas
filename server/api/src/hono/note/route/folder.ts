import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createFolder, getfolder } from '../../../server/note/board';
import {
  deleteFolder,
  deleteFolderTrash,
  getFolderTrash,
  restoreFolderTrash,
  updateFolder,
} from '../../../server/note/folders';

export const folder = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  .get('/folderList', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, folder] = await to(getfolder({ id: auth.sub as string, token }));
    if (error) return c.json({ message: error.message }, 500);
    return c.json(folder);
  })
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        title: z.string(),
        content: z.string(),
        inconId: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { title, content, inconId, workspaceId } = c.req.valid('json');
      const [error, folder] = await to(
        createFolder({
          title,
          content,
          userId: auth.sub as string,
          inconId,
          token,
          workspaceId,
        }),
      );
      if (error) return c.json({ message: error.message }, 500);
      return c.json({ folder });
    },
  )
  .delete(
    '/delete',
    zValidator('query', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('query');
      const [error] = await to(
        deleteFolder({ token, id, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '删除成功' });
    },
  )
  .patch(
    '/update',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        title: z.string(),
        inconId: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, title, inconId, workspaceId } = c.req.valid('json');
      const [error] = await to(
        updateFolder({
          token,
          id,
          title,
          inconId,
          workspaceId,
          userId: auth.sub as string,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '更新成功' });
    },
  )
  .post(
    '/delete',
    zValidator('query', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('query');
      const [error] = await to(
        deleteFolderTrash({ token, id, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '删除成功' });
    },
  )
  .delete(
    '/deleteTrash',
    zValidator('json', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('json');
      const [error] = await to(
        deleteFolder({ token, id, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '删除成功' });
    },
  )
  // 获取白板垃圾桶
  .get('/getTrash', zValidator('query', z.object({ workspaceId: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { workspaceId } = c.req.valid('query');
    const [error, folder] = await to(
      getFolderTrash({ token, workspaceId, userId: auth.sub as string }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(folder);
  })
  // 恢复白板垃圾桶
  .patch(
    '/restoreTrash',
    zValidator('json', z.object({ id: z.string(), workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, workspaceId } = c.req.valid('json');
      const [error] = await to(
        restoreFolderTrash({ token, id, workspaceId, userId: auth.sub as string }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json({ message: '恢复成功' });
    },
  );
