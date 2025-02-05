import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  authSaveBoard,
  copyBoard,
  createBoard,
  deleteBoard,
  getBoard,
  getUserBoard,
  getUserBoardList,
  updateBoard,
} from '../../../server/design/board';
const board = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        json: z.any().optional(),
        width: z.number(),
        height: z.number(),
        isTemplate: z.boolean().optional(),
        image: z.string().optional(),
      }),
    ),
    async (c) => {
      const { name, json, width, height, isTemplate, image } = c.req.valid('json');
      const datas: {
        name: string;
        width: number;
        height: number;
        isTemplate: boolean;
        image?: string;
        json?: string;
      } = {
        name,
        width,
        height,
        isTemplate: !!isTemplate,
      };
      if (isTemplate) datas.image = image;
      if (json) datas.json = json;
      const { auth, token } = getSupabaseAuth(c);
      const [error, board] = await to(
        createBoard(
          {
            userId: auth.sub,
            ...datas,
          },
          token,
        ),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    },
  )
  .get('/getBoardList', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, board] = await to(getUserBoardList({ userid: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
  .get(
    '/getBoard',
    zValidator('query', z.object({ id: z.string(), type: z.enum(['template', 'board']) })),
    async (c) => {
      const { id, type } = c.req.valid('query');
      const { auth, token } = getSupabaseAuth(c);

      const [error, board] = await to(getBoard({ id, userid: auth.sub, token, type }));
      if (error) {
        return c.json({ message: error.message }, errorCheck(error));
      }
      return c.json(board);
    },
  )
  .post('/getBoard', zValidator('json', z.object({ pageParam: z.number() })), async (c) => {
    const { pageParam } = c.req.valid('json');
    const { auth, token } = getSupabaseAuth(c);
    const [error, board] = await to(getUserBoard({ userid: auth.sub, pageParam, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
  .post(
    '/editBoard',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        width: z.number(),
        height: z.number(),
        name: z.string().min(2).max(20),
      }),
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
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    },
  )
  .post('/deleteBoard', zValidator('json', z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid('json');
    const { auth, token } = getSupabaseAuth(c);

    const [error, board] = await to(deleteBoard({ id, userid: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
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
      }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(board);
  })
  .post(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        json: z.any().optional(),
        name: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        image: z.string().optional(),
        isTemplate: z.boolean().optional(),
      }),
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
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(board);
    },
  );

export default board;
