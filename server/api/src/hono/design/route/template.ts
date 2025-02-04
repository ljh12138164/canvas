import to from 'await-to-js';
import { Hono } from 'hono';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import { getTemplate, getUserTemplate } from '../../../server/design/template';

// 获取默认模板
const template = new Hono()
  .get('/default', async (c) => {
    const [error, data] = await to(getTemplate());
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取用户模板
  .get('/userTemplate', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserTemplate(auth.sub, token));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });

export default template;
