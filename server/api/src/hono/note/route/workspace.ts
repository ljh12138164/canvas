import { Hono } from "hono";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import to from "await-to-js";
import {
  createWorkspace,
  getWorkspaceById,
  getWorkspaces,
} from "../../../server/note/workspace";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { errorCheck } from "../../../libs/error";

const workspace = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  // 获取工作区
  .get("/", async (c) => {
    const { token, auth } = getSupabaseAuth(c);

    const [error, workspaces] = await to(
      getWorkspaces({ token, userId: auth.sub })
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(workspaces);
  })
  // 创建工作区
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        inconId: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { name, inconId } = c.req.valid("json");
      const [error, workspace] = await to(
        createWorkspace({
          userId: auth.sub,
          name,
          inconId,
          token,
        })
      );
      if (error) return c.json({ message: error.message }, errorCheck(error));
      return c.json(workspace);
    }
  )
  // 获取工作区
  .get("/:workspaceId", async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const workspaceId = c.req.param("workspaceId");
    const [error, workspace] = await to(
      getWorkspaceById({ token, userId: auth.sub, workspaceId })
    );
    if (error) return c.json({ message: error.message }, errorCheck(error));
    return c.json(workspace);
  });

export { workspace };
