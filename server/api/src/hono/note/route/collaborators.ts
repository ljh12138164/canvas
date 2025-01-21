import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getCollaborators, inviteCollaborator, removeCollaborator } from '../../../server/note/collaborators';

const collaborators = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  // 邀请协作者
  .post(
    '/invite',
    zValidator(
      'json',
      z.object({
        inviteCode: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { inviteCode } = c.req.valid('json');
      const [error, result] = await to(
        inviteCollaborator({
          userId: auth.sub,
          token,
          inviteCode,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  )
  // 获取协作者
  .get('/:workspaceId', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const workspaceId = c.req.param('workspaceId');
    const [error, collaborators] = await to(getCollaborators({ token, workspaceId }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(collaborators);
  })
  // 移除协作者
  .delete(
    '/collaborators',
    zValidator(
      'json',
      z.object({
        userId: z.string(),
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { userId, workspaceId } = c.req.valid('json');
      const [error, result] = await to(
        removeCollaborator({
          token,
          workspaceId,
          userId,
          doUser: auth.sub,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  );

export { collaborators };
