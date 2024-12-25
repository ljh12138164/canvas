import {
  authSaveBoard,
  createBoard,
  deleteBoard,
  getBoard,
  getUserBoard,
  copyBoard,
  updateBoard,
  getUserImage,
  getUserBoardList,
} from '../../../server/design/board';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import to from 'await-to-js';
import { errorCheck } from '../../../libs/error';
const board = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        json: z.string(),
        width: z.number(),
        height: z.number(),
      })
    ),
    async (c) => {
      const { name, json, width, height } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);
      const [error, board] = await to(
        createBoard(
          {
            userId: auth.sub,
            name,
            json,
            width,
            height,
          },
          token
        )
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    }
  )
  .get('/getBoardList', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, board] = await to(
      getUserBoardList({ userid: auth.sub, token })
    );
    console.log(error, board);
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
  .get('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.param();
    const { auth, token } = getSupabaseAuth(c);

    const [error, board] = await to(getBoard({ id, userid: auth.sub, token }));
    if (error) {
      return c.json({ message: error.message }, errorCheck(error));
    }
    return c.json(board);
  })
  .post(
    '/getBoard',
    zValidator('json', z.object({ pageParam: z.number() })),
    async (c) => {
      const { pageParam } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);
      const [error, board] = await to(
        getUserBoard({ userid: auth.sub, pageParam, token })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    }
  )
  .post(
    '/editBoard',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        width: z.number(),
        height: z.number(),
        name: z.string().min(2).max(20),
      })
    ),
    async (c) => {
      const { id, name, width, height } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);
      const [error, board] = await to(
        updateBoard({
          id,
          name,
          userId: auth.sub,
          width,
          height,
          token,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    }
  )
  .post(
    '/deleteBoard',
    zValidator('json', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);

      const [error, board] = await to(
        deleteBoard({ id, userid: auth.sub, token })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    }
  )
  .post('/clone', async (c) => {
    const { name, json, width, height } = await c.req.json();
    if (!name || !width || !height) {
      return c.json({ message: '请输入完整信息' }, 400);
    }
    const { auth, token } = getSupabaseAuth(c);
    const [error, board] = await to(
      copyBoard({
        userId: auth.sub,
        board: {
          name,
          json,
          width,
          height,
        },
        token,
      })
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
  .post('/image', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserImage({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  .post(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        json: z.string().optional(),
        name: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        isTemplate: z.boolean().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.param();
      const value = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);

      const [error, board] = await to(
        authSaveBoard({
          id,
          ...value,
          userId: auth.sub,
          token,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    }
  );

export default board;
