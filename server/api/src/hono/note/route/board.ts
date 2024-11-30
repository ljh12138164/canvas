import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { checkToken, getSupabaseAuth } from "../../../libs/middle";

export const board = new Hono()
  .use(checkToken)
  .get("/", zValidator("query", z.object({ id: z.string() })), async (c) => {
    const token = getSupabaseAuth(c);
    const { id } = c.req.valid("query");
    const secret = process.env.NOTE_JWT_SECRET;

    if (!token) {
      return c.json({ message: "token is required" }, 401);
    }

    if (!secret) {
      return c.json({ message: "JWT secret is not configured" }, 500);
    }

    return c.json({
      message: "success",
    });
  })
  .post("/create", (c) => {
    return c.json({ message: "Hello World" });
  });
