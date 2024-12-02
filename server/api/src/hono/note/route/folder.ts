import { zValidator } from "@hono/zod-validator";
import to from "await-to-js";
import { Hono } from "hono";
import { z } from "zod";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import { getfolder } from "../../../server/note/board";

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
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      // const [error, board] = await to(
      //   createBoard({
      //     title: "test",
      //     content: "test",
      //     id: auth.session_id as string,
      //     inconId,
      //     token,
      //   })
      // );
      // if (error) return c.json({ message: error.message }, 500);
      // return c.json({ board });
    }
  );
