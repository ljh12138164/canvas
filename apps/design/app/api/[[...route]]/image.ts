import unsplash from "@/lib/unsplash";
import { Hono } from "hono";
const DEFALUT_COUNT = 20;
const DEFALUT_COLLECTION_IDS = ["317099"];
const image = new Hono().get("/", async (c) => {
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
});
export default image;
