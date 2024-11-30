import { getUserImage } from "../../../server/design";
import unsplash from "../../../libs/unsplash";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
// 获取图片
const DEFALUT_COUNT = 20;
const DEFALUT_COLLECTION_IDS = ["317099"];

const image = new Hono()
  .get("/", async (c) => {
    const image = await unsplash.photos.getRandom({
      collectionIds: DEFALUT_COLLECTION_IDS,
      count: DEFALUT_COUNT,
    });
    if (image.errors) return c.json({ errors: image.errors }, 400);
    let response = image.response;
    if (!Array.isArray(response)) {
      response = [response];
    }
    return c.json({
      data: response,
    });
  })
  .post(
    "/userImage",
    zValidator("json", z.object({ userId: z.string() })),
    async (c) => {
      try {
        const { userId } = c.req.valid("json");
        const data = await getUserImage({ userId });
        return c.json(data);
      } catch {
        return c.json({ message: "获取图片失败" }, 400);
      }
    }
  );

export default image;
