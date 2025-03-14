import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoardDetail,
  getInviteCodeData,
  updateBoard,
  updateBoardInviteCode,
  updateBoardSchema,
} from '../../../server/form/board';

export const board = new Hono()
  .use(checkToken(process.env.SUPABASE_FORM_JWT!))
  .get('/form', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, result] = await to(
      getBoard({
        token,
        userId: auth.sub,
      }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  .post(
    '/form',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        schema: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const [error, result] = await to(
        createBoard({
          token,
          id: c.req.valid('json').id,
          userId: auth.sub,
          name: c.req.valid('json').name,
          description: c.req.valid('json').description ?? '',
          schema: c.req.valid('json').schema,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  )
  .delete('/form', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { id } = c.req.valid('json');
    const [error, result] = await to(deleteBoard({ token, userId: auth.sub, boardId: id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  .patch(
    '/form',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        schema: z.string().optional(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, name, description, schema } = c.req.valid('json');
      const [error, result] = await to(
        updateBoard({
          token,
          userId: auth.sub,
          boardId: id,
          name,
          description,
          schema,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  )
  // 获取表单详情·
  .get('/form/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { id } = c.req.valid('param');
    const [error, result] = await to(getBoardDetail({ token, userId: auth.sub, boardId: id }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  // 更新邀请码
  .patch('/update', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const { id } = c.req.valid('json');
    const [error, result] = await to(
      updateBoardInviteCode({ token, userId: auth.sub, boardId: id }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  // 获取提交数据
  .get('/submit', zValidator('query', z.object({ inviteCode: z.string() })), async (c) => {
    const { token } = getSupabaseAuth(c);
    const { inviteCode } = c.req.valid('query');
    const [error, result] = await to(getInviteCodeData({ token, inviteCode }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  // 更新表单数据
  .patch(
    '/shema',
    zValidator('json', z.object({ id: z.string(), schema: z.string() })),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, schema } = c.req.valid('json');
      const [error, result] = await to(
        updateBoardSchema({ token, userId: auth.sub, boardId: id, schema }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  );
