import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { z } from "zod";

export const user = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(6).max(20),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.json();

    return c.json({ email, password });
  }
);
