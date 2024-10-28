import { createUser } from "@/api/supabase/sign";
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
      accoute: z.string().min(5),
      password: z.string(),
    })
  ),
  async (c) => {
    try {
      const { name, accoute, password } = c.req.valid("json");
      const user = await createUser({ name, account: accoute, password });
      if (!user) throw new Error("注册失败");

      return c.json(user, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "注册失败" }, 400);
    }
  }
);

export default user;
