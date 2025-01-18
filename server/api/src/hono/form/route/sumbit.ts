import { Hono } from "hono";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { to } from "await-to-js";
import { errorCheck } from "../../../libs/error";
import { createSubmit } from "../../../server/form/sumbit";

export const submit = new Hono()
  .use(checkToken(process.env.SUPABASE_FORM_JWT!))
  .post(
    "/form",
    zValidator(
      "json",
      z.object({
        id: z.string(),
        submit: z.string(),
      })
    ),
    async (c) => {
      const { token, auth } = getSupabaseAuth(c);
      const { id, submit } = c.req.valid("json");
      const [error, result] = await to(
        createSubmit({
          token,
          id,
          userId: auth.sub,
          submit,
        })
      );
      if (error) return c.json(error.message, errorCheck(error));
      return c.json(result);
    }
  );
