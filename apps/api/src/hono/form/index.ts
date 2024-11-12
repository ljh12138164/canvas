import { Hono } from "hono";
export const form = new Hono().get("/", (c) => {
  return c.json({ message: "Hello World" });
});
