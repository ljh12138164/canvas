import { Hono } from "hono";
import { getCookie } from "hono/cookie";

export const vue = new Hono().get("/abc", (c) => {
  const auth = getCookie(c);
  console.log(auth);
  return c.json({ auth });
});
