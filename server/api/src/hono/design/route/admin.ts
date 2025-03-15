import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import {
  getAiList,
  getBoardList,
  getCollectionsList,
  getDashboardList,
  getMaterialList,
  getShowList,
  getUpvotesList,
  getUserDataList,
  getUserList,
  validateAdmin,
} from '../../../server/design/admin';

export const admin = new Hono()
  .post(
    '/login',
    zValidator('json', z.object({ username: z.string(), password: z.string() })),
    async (c) => {
      const { username, password } = c.req.valid('json');
      const [error] = await to(validateAdmin(username, password));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      const token = await sign(
        // 设置过期时间为30天
        { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
        process.env.JWT_SECRET!,
      );
      return c.json({ token });
    },
  )
  .use(async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return c.json({ message: '请先登录' }, errorCheck(new Error('请先登录')));
    const { exp } = await verify(token, process.env.JWT_SECRET!);
    if (!exp || exp < Math.floor(Date.now() / 1000))
      return c.json({ message: '登录已过期' }, errorCheck(new Error('登录已过期')));
    await next();
  })
  // 话题
  .post(
    '/show',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getShowList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 作品
  .post(
    '/board',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getBoardList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 素材
  .post(
    '/material',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getMaterialList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 点赞
  .post(
    '/upvotes',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getUpvotesList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 收藏
  .post(
    '/collections',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getCollectionsList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 用户
  .post(
    '/user',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getUserList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 用户数据
  .post(
    '/template',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getUserDataList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // AI
  .post(
    '/ai',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getAiList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .post(
    '/dashboard',
    zValidator(
      'json',
      z.object({ startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional() }),
    ),
    async (c) => {
      const { startDate, endDate } = c.req.valid('json');
      const [error, data] = await to(getDashboardList(startDate, endDate));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
