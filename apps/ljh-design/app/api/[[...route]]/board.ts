import {
  createBoard,
  deleteBoard,
  getBoard,
  getUserBoard,
  updateBoard,
} from '@/api/supabase/board';
import { checkoutCookie } from '@/lib/sign';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
const board = new Hono()
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
      let user;
      try {
        user = await checkoutCookie(c);
      } catch {
        return c.json({ message: '请先登录' }, 401);
      }
      const { name, json, width, height } = c.req.valid('json');
      try {
        const board = await createBoard({
          userId: user.userid,
          name,
          json,
          width,
          height,
        });
        return c.json(board);
      } catch (error) {
        console.log(error);
        return c.json({ message: '创建失败' }, 400);
      }
    }
  )
  .get('/:id', async (c) => {
    const { id } = c.req.param();
    let user;
    try {
      user = await checkoutCookie(c);
    } catch {
      return c.json({ message: '获取失败' }, 400);
    }
    try {
      const board = await getBoard({ id, userid: user.userid });
      return c.json(board);
    } catch (error) {
      console.log(error);
      return c.json({ message: '获取失败' }, 400);
    }
  })
  .post(
    '/getBoard',
    zValidator('json', z.object({ userid: z.string(), pageParam: z.number() })),
    async (c) => {
      const { userid, pageParam } = c.req.valid('json');
      try {
        await checkoutCookie(c);
      } catch {
        return c.json({ message: '请先登录' }, 401);
      }
      try {
        const board = await getUserBoard({ userid, pageParam });
        return c.json(board);
      } catch {
        return c.json({ message: '获取失败' }, 400);
      }
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
      let user;
      try {
        user = await checkoutCookie(c);
      } catch {
        return c.json({ message: '请先登录' }, 401);
      }
      try {
        const board = await updateBoard({
          id,
          name,
          userId: user.userid,
          width,
          height,
        });
        return c.json(board);
      } catch {
        return c.json({ message: '更新失败' }, 400);
      }
    }
  )
  .post(
    '/deleteBoard',
    zValidator('json', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('json');
      let user;
      try {
        user = await checkoutCookie(c);
      } catch {
        return c.json({ message: '请先登录' }, 401);
      }
      try {
        const board = await deleteBoard({ id, userid: user.userid });
        return c.json(board);
      } catch {
        return c.json({ message: '删除失败' }, 400);
      }
    }
  );

export default board;
