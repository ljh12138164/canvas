import { createUser } from "@/api/supabase/sign";
import { jwtEncode } from "@/lib/sign";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import { hashSync } from "bcryptjs";
import { setCookie } from "hono/cookie";
import { z } from "zod";
//模范请求
const user = new Hono()
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(2).max(10),
        accoute: z.string().min(5).max(10),
        password: z.string(),
      })
    ),
    async (c) => {
      try {
        const { name, accoute, password } = c.req.valid("json");
        const hashPassword = hashSync(password, 10);
        const user = await createUser({
          name,
          account: accoute,
          password: hashPassword,
        });
        if (!user) throw new Error("注册失败");
        const token = await jwtEncode({
          userid: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        setCookie(c, "token", token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return c.json(user, 200);
      } catch (error) {
        console.error(error);
        return c.json({ message: "注册失败" }, 400);
      }
    }
  )
  .post("/sign-out", async (c) => {
    deleteCookie(c, "token");
    return c.json({ message: "退出成功" }, 200);
  });
export default user;
