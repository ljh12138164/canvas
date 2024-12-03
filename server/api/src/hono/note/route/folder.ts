import { zValidator } from "@hono/zod-validator";
import to from "await-to-js";
import { Hono } from "hono";
import { z } from "zod";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import { createFolder, getfolder } from "../../../server/note/board";

export const folder = new Hono()
  .use(checkToken(process.env.SUPABASE_NOTE_JWT!))
  .get("/folderList", async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, folder] = await to(
      getfolder({ id: auth.session_id as string, token })
    );
    if (error) return c.json({ message: error.message }, 500);
    return c.json(folder);
  })
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        title: z.string(),
        content: z.string(),
        inconId: z.string(),
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { title, content, inconId, workspaceId } = c.req.valid("json");
      const [error, folder] = await to(
        createFolder({
          title,
          content,
          userId: auth.user_metadata.sub as string,
          inconId,
          token,
          workspaceId,
        })
      );
      if (error) return c.json({ message: error.message }, 500);
      return c.json({ folder });
    }
  );
