import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createWorkspace,
  getDoc,
  getWorkspaceById,
  getWorkspaces,
} from '../../../server/note/workspace';

const workspace = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  // 获取工作区
  .get(
    '/workspaces/:workspaceId',
    zValidator('param', z.object({ workspaceId: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const workspaceId = c.req.valid('param').workspaceId;
      const [error, workspace] = await to(
        getWorkspaceById({ token, userId: auth.sub, workspaceId }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  // 获取工作区
  .get('/workspaces', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, workspaces] = await to(getWorkspaces({ token, userId: auth.sub }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(workspaces);
  })
  // 创建工作区
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        inconId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { name, inconId } = c.req.valid('json');
      const [error, workspace] = await to(
        createWorkspace({
          userId: auth.sub,
          name,
          inconId,
          token,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    },
  )
  .get(
    '/doc',
    zValidator(
      'query',
      z.object({
        id: z.string(),
        type: z.enum(['file', 'folder']),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { id, type, workspaceId } = c.req.valid('query');
      const { token, auth } = getSupabaseAuth(c);
      const [error, doc] = await to(getDoc({ token, userId: auth.sub, id, type, workspaceId }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(doc);
    },
  );

export { workspace };
