import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { addFrident, addFriend, getFriendList, searchFriend } from '../../../server/design/friend';

export const friend = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 添加好友
  .post('/friend', zValidator('json', z.object({ addUserId: z.string() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { addUserId } = c.req.valid('json');
    const [error, data] = await to(addFriend({ userId: auth.sub!, addUserId, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 获取好友列表
  .get('/friendList', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getFriendList({ userId: auth.sub!, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 搜索好友
  .get('/searchFriend', zValidator('query', z.object({ search: z.string() })), async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const { search } = c.req.valid('query');
    const [error, data] = await to(searchFriend({ userId: auth.sub!, token, search }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 添加好友
  .post('add', zValidator('json', z.object({ id: z.string(), adduser: z.string() })), async (c) => {
    const { token } = getSupabaseAuth(c);
    const { id, adduser } = c.req.valid('json');
    const [error, data] = await to(addFrident({ id, token, adduser }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });
