import { Hono } from "hono";
import { getCookie } from "hono/cookie";

export const form = new Hono().get("/abc", (c) => {
  return c.json("sdf");
});
