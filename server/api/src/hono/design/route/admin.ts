import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { validateAdmin } from '../../../server/design/admin';

export const admin = new Hono().post(
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
);
