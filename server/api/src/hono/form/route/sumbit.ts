import { zValidator } from '@hono/zod-validator';
import { to } from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import {
  createSubmit,
  getMySubmit,
  getMySubmitById,
  getMysumbitForm,
} from '../../../server/form/sumbit';

export const submit = new Hono()
  .use(checkToken(process.env.SUPABASE_FORM_JWT!))
  .post(
    '/form',
    zValidator(
      'json',
      z.object({
        id: z.string(),
        submit: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, submit } = c.req.valid('json');
      const [error, result] = await to(
        createSubmit({
          token,
          id,
          userId: auth.sub,
          submit,
        }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  )
  // 获取我的提交
  .get('/mySubmit', async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, result] = await to(
      getMySubmit({
        token,
        userId: auth.sub,
      }),
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(result);
  })
  .get(
    '/submit',
    zValidator(
      'query',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id } = c.req.valid('query');
      const [error, result] = await to(getMySubmitById({ token, id, userId: auth.sub }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  )
  //获取提交的表单
  .get(
    '/sumbitForm',
    zValidator(
      'query',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id } = c.req.valid('query');
      const [error, result] = await to(getMysumbitForm({ token, id, userId: auth.sub }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(result);
    },
  );
