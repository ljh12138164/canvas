import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
//模范请求
const user = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (c) => {
    const { name, email, password } = c.req.valid("json");
    // 创建用户
    const user = {};
    return c.json(user, 200);
  }
);

export default user;
