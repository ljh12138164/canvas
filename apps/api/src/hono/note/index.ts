import { Hono } from "hono";
export const note = new Hono().get("/", (c) => {
  return c.json({ message: "Hello World" });
});
