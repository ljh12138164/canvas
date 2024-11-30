import { Hono } from "hono";
import { getCookie } from "hono/cookie";

export const vue = new Hono().get("/abc", (c) => {
  const auth = getCookie(c);
  return c.json({ auth });
});
