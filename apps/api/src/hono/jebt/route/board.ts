import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createJebtWorkspace,
  getJebtWorkspace,
} from "../../../server/jebt/board";
import { z } from "zod";
import to from "await-to-js";
const board = new Hono()
  .post(
    "/create",
    zValidator(
      "form",
      z.object({ name: z.string(), file: z.any(), userId: z.string() })
    ),
    async (c) => {
      const body = await c.req.parseBody();
      const { userId, name, file } = body;
      const [error, workspace] = await to(
        createJebtWorkspace({
          name: name as string,
          userId: userId as string,
          file,
        })
      );
      if (error) throw error;
      return c.json(workspace);
    }
  )
  // 参数请求
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({ id: z.string().min(1, { message: "userID不能为空" }) })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const [error, workspace] = await to(getJebtWorkspace(id));
      console.log(workspace, error);
      if (error) throw error;
      return c.json(workspace);
    }
  );
export default board;
