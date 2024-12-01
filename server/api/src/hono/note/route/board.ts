import { zValidator } from "@hono/zod-validator";
import to from "await-to-js";
import { Hono } from "hono";
import { z } from "zod";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import { getBoard } from "../../../server/note/board";

export const board = new Hono()
  .use(checkToken(process.env.NOTE_JWT_SECRET!))
  .get("/board", async (c) => {
    const { token, auth } = getSupabaseAuth(c);
    const [error, board] = await to(
      getBoard({ id: auth.session_id as string, token })
    );
    if (error) return c.json({ message: error.message }, 500);
    return c.json(board);
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
