import { zValidator } from '@hono/zod-validator';
import { to } from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { createMaterial, editMaterial, getMaterial } from '../../../server/design/material';
export const material = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取素材
  .get('/material', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getMaterial({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 创建素材
  .post(
    '/material',
    zValidator(
      'json',
      z.object({
        material: z.any(),
        name: z.string(),
        id: z.string(),
        cloneId: z.string().optional(),
      }),
    ),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { material, name, id, cloneId } = await c.req.json();
      const [error, data] = await to(
        createMaterial({ userId: auth.sub, token, material, name, id, cloneId }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  // 编辑素材
  .patch(
    '/material',
    zValidator('json', z.object({ name: z.string(), id: z.string() })),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { name, id } = await c.req.json();
      const [error, data] = await to(editMaterial({ userId: auth.sub, token, name, id }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );
