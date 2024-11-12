import { Hono } from "hono";
export const vue = new Hono().get("/", (c) => {
  return c.json({ message: "Hello World" });
});
