import to from "await-to-js";
import { Hono } from "hono";
import { errorCheck } from "../../../libs/error";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import unsplash from "../../../libs/unsplash";
import { getUserImage } from "../../../server/design";
// 获取图片
const DEFALUT_COUNT = 20;
const DEFALUT_COLLECTION_IDS = ["317099"];

const image = new Hono()
  .get("/", async (c) => {
    const image = await unsplash.photos.getRandom({
      collectionIds: DEFALUT_COLLECTION_IDS,
      count: DEFALUT_COUNT,
    });
    console.log(image.errors);
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
  .post("/userImage", async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserImage({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  });

export default image;
