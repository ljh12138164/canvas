import { zValidator } from '@hono/zod-validator';
import to from 'await-to-js';
import { Hono } from 'hono';
import { z } from 'zod/lib';
import { errorCheck } from '../../../libs/error';
import { checkToken, getSupabaseAuth } from '../../../libs/middle';
import unsplash from '../../../libs/unsplash';
import { createUserImage, deleteUserImage, getUserImage } from '../../../server/design/image';
// 获取图片
const DEFALUT_COUNT = 20;
const DEFALUT_COLLECTION_IDS = ['317099'];

const image = new Hono()
  .get('/', async (c) => {
    const image = await unsplash.photos.getRandom({
      collectionIds: DEFALUT_COLLECTION_IDS,
      count: DEFALUT_COUNT,
    });
    // console.log(image.errors);
    if (image.errors) return c.json({ errors: image.errors }, 400);
    let response = image.response;
    if (!Array.isArray(response)) {
      response = [response];
    }
    return c.json({
      data: response,
    });
  })
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取用户图片
  .get('/userImage', async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserImage({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 创建用户图片
  .post(
    '/userImage',
    zValidator('json', z.object({ url: z.string(), star: z.boolean().optional() })),
    async (c) => {
      const { url, star } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);
      const [error, data] = await to(
        createUserImage({ userId: auth.sub, token, url, star: star ?? false }),
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  )
  .delete(
    '/userImage',
    zValidator('json', z.object({ id: z.string(), url: z.string() })),
    async (c) => {
      const { id, url } = c.req.valid('json');
      const { auth, token } = getSupabaseAuth(c);
      const [error, data] = await to(deleteUserImage({ userId: auth.sub, token, id, url }));
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    },
  );

export default image;
