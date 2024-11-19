import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createJebtWorkspace } from "../../../server/jebt/board";
import { z } from "zod";
import to from "await-to-js";
const board = new Hono().post(
  "/create",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1, { message: "仪表盘名称不能为空" }),
      userId: z.string().min(1, { message: "用户ID不能为空" }),
    })
  ),
  async (c) => {
    const { name, userId } = c.req.valid("json");
    const [error, workspace] = await to(createJebtWorkspace({ name, userId }));
    if (error) throw error;
    return c.json(workspace);
  }
);
export default board;
