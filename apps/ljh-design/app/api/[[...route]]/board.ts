import { createBoard } from "@/api/supabase/board";
import { jwtDecode } from "@/lib/sign";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { z } from "zod";
const board = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      json: z.string(),
      width: z.number(),
      height: z.number(),
    })
  ),
  async (c) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({ message: "请先登录" }, 401);
    const user = await jwtDecode(token);
    if (!user) return c.json({ message: "请先登录" }, 401);
    const { name, json, width, height } = c.req.valid("json");
    try {
      const board = await createBoard({
        id: user.userid,
        name,
        json,
        width,
        height,
      });
      return c.json(board);
    } catch {
      return c.json({ message: "创建失败" }, 500);
    }
  }
);

export default board;
