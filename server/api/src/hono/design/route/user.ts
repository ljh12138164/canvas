import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getUserData, updatePassword, updateUser } from '../../../server/design/user/index';
import { getUserCollect, getUserLike } from '../../../server/design/user/index';
import {
  getUserCollectByOther,
  getUserLikeByOther,
  getUserPosts,
  getUserProfile,
} from '../../../server/design/user/index';

export const user = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 更新用户信息
  .post(
    '/update',
    zValidator(
      'json',
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
        region: z.string().optional(),
      }),
    ),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { name, image, region } = c.req.valid('json');
      const [error, data] = await to(updateUser({ token, id: auth.sub!, name, image, region }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 更新用户密码
  .post('/password', zValidator('json', z.object({ password: z.string() })), async (c) => {
    const { auth } = getSupabaseAuth(c);
    const { password } = c.req.valid('json');
    const [error, data] = await to(updatePassword({ password, userId: auth.sub! }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 获取用户点赞
  .get('/like', zValidator('query', z.object({ search: z.string().optional() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { search } = c.req.valid('query');
    const [error, data] = await to(getUserLike({ token, userId: auth.sub!, search: search ?? '' }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 获取用户的收藏
  .get('/collect', zValidator('query', z.object({ search: z.string().optional() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { search } = c.req.valid('query');
    const [error, data] = await to(
      getUserCollect({ token, userId: auth.sub!, search: search ?? '' }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  .get(
    '/data',
    zValidator(
      'query',
      z.object({
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
      }),
    ),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { startTime, endTime } = c.req.valid('query');
      const [error, data] = await to(getUserData({ token, userId: auth.sub!, startTime, endTime }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 获取用户完整个人资料
  .get(
    '/profile',
    zValidator(
      'query',
      z.object({
        userId: z.string(),
      }),
    ),
    async (c) => {
      const { userId } = c.req.valid('query');
      const [error, data] = await to(
        getUserProfile({
          userId,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 获取其他用户发送的帖子
  .get(
    '/otherPosts',
    zValidator(
      'query',
      z.object({
        userId: z.string(),
        search: z.string().optional(),
      }),
    ),
    async (c) => {
      const { userId, search } = c.req.valid('query');
      const [error, data] = await to(
        getUserPosts({
          userId,
          search: search ?? '',
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 获取其他用户点赞的帖子
  .get(
    '/otherLikes',
    zValidator(
      'query',
      z.object({
        userId: z.string(),
        search: z.string().optional(),
      }),
    ),
    async (c) => {
      const { userId, search } = c.req.valid('query');
      const [error, data] = await to(
        getUserLikeByOther({
          userId,
          search: search ?? '',
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 获取其他用户收藏的帖子
  .get(
    '/otherCollections',
    zValidator(
      'query',
      z.object({
        userId: z.string(),
        search: z.string().optional(),
      }),
    ),
    async (c) => {
      const { userId, search } = c.req.valid('query');
      const [error, data] = await to(
        getUserCollectByOther({
          userId,
          search: search ?? '',
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
