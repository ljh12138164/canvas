import { Hono } from "hono";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import { errorCheck } from "../../../libs/error";
import to from "await-to-js";
import { createUserTap, getUserTap } from "../../../server/design/tap";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const tap = new Hono()
  .use(checkToken(process.env.SUPABASE_DESIGN_JWT!))
  // 获取用户的标签
  .get("/userTap", async (c) => {
    const { auth, token } = getSupabaseAuth(c);
    const [error, data] = await to(getUserTap({ userId: auth.sub, token }));
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(data);
  })
  // 创建标签
  .post(
    "/create",
    zValidator("json", z.object({ tag: z.string(), userId: z.string() })),
    async (c) => {
      const { auth, token } = getSupabaseAuth(c);
      const { tag } = c.req.valid("json");
      const [error, data] = await to(
        createUserTap({ userId: auth.sub, token, tag })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(data);
    }
  );
export default tap;
